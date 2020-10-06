import { Server, IncomingMessage, ServerResponse } from 'http';
import { join, resolve } from 'path';
import { fastify, FastifyInstance } from 'fastify';
import { connection, connect } from 'mongoose';
import ejs from 'ejs';

import Option from './models/Option';
import mailgun from './services/mailgun';
import authenticate from './middlewares/authenticate';
import document from './utilities/document';
import upload from './utilities/upload';
import token, { iToken } from './utilities/token';
import { MINUTE_IN_SECONDS } from './utilities';

export default class {
  private server: FastifyInstance<Server, IncomingMessage, ServerResponse>;
  private port: number | string;

  constructor() {
    this.port = process.env.PORT || 3000;

    this.server = fastify({
      ignoreTrailingSlash: true,
      logger: { level: 'error', prettyPrint: { colorize: true, translateTime: 'yyyy-mm-dd HH:MM:ss', ignore: 'pid,hostname' } },
    });

    this.initDb().catch((err) => this.server.log.error({ actor: 'MongoDB' }, err));
    this.registerPlugins();
    this.registerRoutes();
  }

  public async start() {
    await this.server.listen(this.port as number, '0.0.0.0').catch(console.log);

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
      secret: process.env.JWT_SECRET_KEY,
      sign: { expiresIn: '7d' },
      cookie: { cookieName: 'token' },
      trusted: this.validUsers,
    });

    this.server.register(mailgun);
    this.server.register(token);
    this.server.register(authenticate);
    this.server.register(document);
    this.server.register(upload);

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

  private registerRoutes() {
    this.server.register(import('fastify-autoload'), {
      dir: join(__dirname, 'routes'),
    });
  }

  private async validUsers(request, decodedToken: iToken) {
    const { email, banned } = decodedToken.user;

    if (banned) return false;

    const banUsers = await Option.findOne({ name: 'ban_users' });

    return !banUsers?.data?.includes(email);
  }
}
