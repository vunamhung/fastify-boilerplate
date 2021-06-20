import { Server, IncomingMessage, ServerResponse } from 'http';
import { join, resolve } from 'path';
import { fastify, FastifyInstance } from 'fastify';
import { connection, connect } from 'mongoose';
import camelcaseKeys from 'camelcase-keys';
import omitEmpty from 'omit-empty';
import ejs from 'ejs';

import mailgun from './services/mailgun';
import document from './utilities/document';
import uploader from './utilities/uploader';
import authenticate from './utilities/authenticate';
import { MINUTE_IN_SECONDS } from './utilities';

export default class {
  private server: FastifyInstance<Server, IncomingMessage, ServerResponse>;

  constructor() {
    this.server = fastify({
      ignoreTrailingSlash: true,
      logger: { level: 'error', prettyPrint: { colorize: true, translateTime: 'yyyy-mm-dd HH:MM:ss', ignore: 'pid,hostname' } },
    });

    this.initDb().catch((err) => this.server.log.error({ actor: 'MongoDB' }, err));
    this.registerHooks();
    this.registerPlugins();
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

  private registerHooks() {
    this.server.addHook('onRequest', (request, reply, done) => {
      request.body = camelcaseKeys(request.body, { deep: true });
      request.params = camelcaseKeys(request.params);
      request.query = camelcaseKeys(request.query);

      //remove empty properties
      request.body = omitEmpty(request.body);
      request.params = omitEmpty(request.params);
      request.query = omitEmpty(request.query);
      done();
    });
  }

  private registerPlugins() {
    this.server.register(import('fastify-jwt'), {
      secret: process.env.ACCESS_TOKEN_SECRET,
      cookie: { cookieName: 'token', signed: false },
    });

    this.server.register(authenticate);
    this.server.register(mailgun);
    this.server.register(document);
    this.server.register(uploader);

    this.server.register(import('fastify-cookie'));
    this.server.register(import('under-pressure'), { maxEventLoopDelay: 1000, message: 'Under pressure!', retryAfter: 50 });
    this.server.register(import('fastify-helmet'), {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"], // default source is mandatory
          imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
          scriptSrc: ["'self'", "'sha256-2yQBTLGLI1sDcBILfj/o6b5ufMv6CEwPYOk3RZI/WjE='"],
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
    this.server.register(import('fastify-cors'), {
      origin: ['http://localhost:3001'],
      credentials: true,
    });
    this.server.register(import('fastify-blipp'));
    this.server.register(import('fastify-no-icon'));
    this.server.register(import('fastify-static'), { root: join(__dirname, '../public'), prefix: '/public/' });
    this.server.register(import('point-of-view'), {
      engine: { ejs },
      templates: join(__dirname, '../templates'),
      options: { filename: resolve(__dirname, '../templates') },
      includeViewExtension: true,
    });
  }

  private registerRoutes() {
    this.server.register(import('fastify-autoload'), {
      dir: join(__dirname, 'routes'),
    });
  }
}
