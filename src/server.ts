import { Server, IncomingMessage, ServerResponse } from 'http';
import { join, resolve } from 'path';
import { fastify, FastifyInstance } from 'fastify';
import { connection, connect } from 'mongoose';
import ejs from 'ejs';

import mailgun from './services/mailgun';
import document from './utilities/document';
import uploader from './utilities/uploader';
import authenticate from './utilities/authenticate';
import token, { iToken } from './utilities/token';
import { MINUTE_IN_SECONDS } from './utilities';

export default class {
  private server: FastifyInstance<Server, IncomingMessage, ServerResponse>;

  constructor() {
    this.server = fastify({
      ignoreTrailingSlash: true,
      logger: { level: 'error', prettyPrint: { colorize: true, translateTime: 'yyyy-mm-dd HH:MM:ss', ignore: 'pid,hostname' } },
    });

    this.initDb().catch((err) => this.server.log.error({ actor: 'MongoDB' }, err));
    this.registerPlugins();
    this.registerHooks();
    this.registerRoutes();
  }

  public async start() {
    await this.server.listen(3000, '0.0.0.0').catch(console.log);

    this.server.blipp();
    this.server.swagger();

    console.log('Server listening on', this.server.server.address());
    process.on('uncaughtException', console.error);
    process.on('unhandledRejection', console.error);
  }

  private async initDb() {
    connection.on('connected', () => console.log('MongoDB connected successfully'));
    connection.on('disconnected', () => this.server.log.error({ actor: 'MongoDB' }, 'disconnected'));

    await connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      keepAlive: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  }

  private registerPlugins() {
    this.server.register(import('fastify-jwt'), {
      secret: process.env.ACCESS_TOKEN_SECRET,
      cookie: { cookieName: 'accessToken' },
      trusted: (request, { user }: iToken) => user?.banned != true,
    });

    this.server.register(authenticate);
    this.server.register(mailgun);
    this.server.register(token);
    this.server.register(document);
    this.server.register(uploader);

    this.server.register(import('under-pressure'), { maxEventLoopDelay: 1000, message: 'Under pressure!', retryAfter: 50 });
    this.server.register(import('fastify-helmet'), {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"], // default source is mandatory
          imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
          scriptSrc: ["'self'", "'sha256-iV83EgAQc1+Q++O7L1ZemfWFbYYPNv2syB2HreE5S/8='"],
          styleSrc: ["'self'", "'unsafe-inline'"],
        },
      },
    });
    this.server.register(import('fastify-sensible'));
    this.server.register(import('fastify-guard'), {
      errorHandler: (result, req, reply) => reply.forbidden('You are not allowed to make this request.'),
    });
    this.server.register(import('fastify-compress'));
    this.server.register(import('fastify-rate-limit'), { max: 100, timeWindow: MINUTE_IN_SECONDS, cache: 10000 });
    this.server.register(import('fastify-response-caching'), { ttl: 2000 });
    this.server.register(import('fastify-prettier'));
    this.server.register(import('fastify-cors'), { preflight: true, credentials: true });
    this.server.register(import('fastify-blipp'));
    this.server.register(import('fastify-no-icon'));
    this.server.register(import('fastify-qs'), { disabled: false });
    this.server.register(import('fastify-static'), { root: join(__dirname, '../public'), prefix: '/public/' });
    this.server.register(import('point-of-view'), {
      engine: { ejs },
      templates: join(__dirname, '../templates'),
      options: { filename: resolve(__dirname, '../templates') },
      includeViewExtension: true,
    });
  }

  private registerHooks() {
    this.server.addHook('onRequest', (request, reply, done) => {
      if (request.headers.authorization?.split(' ')[1]) {
        request.user = this.server.decodedToken(request)?.user;
      }

      done();
    });
  }

  private registerRoutes() {
    this.server.register(import('fastify-autoload'), {
      dir: join(__dirname, 'routes'),
    });
  }
}
