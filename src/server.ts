import { join, resolve } from 'path';
import { connection, connect } from 'mongoose';
import { fastify, FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import ejs from 'ejs';

import mailgun from './services/mailgun';
import authenticate from './utilities/authenticate';
import document from './utilities/document';
import { MINUTE_IN_SECONDS } from './utilities/constants';

export default class {
  private server: FastifyInstance<Server, IncomingMessage, ServerResponse>;
  private port: number | string;

  constructor() {
    this.port = process.env.PORT || 3000;
    const logger = { level: 'error', prettyPrint: { colorize: true, translateTime: 'yyyy-mm-dd HH:MM:ss', ignore: 'pid,hostname' } };

    this.server = fastify({ ignoreTrailingSlash: true, logger });

    this.initDb();
    this.registerPlugins();
    this.registerRoutes();
  }

  public async initDb() {
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

  public async start() {
    await this.server.listen(this.port as number, '0.0.0.0').catch(console.log);

    this.server.blipp();
    this.server.swagger();

    console.log('Server listening on', this.server.server.address());
    process.on('uncaughtException', console.error);
    process.on('unhandledRejection', console.error);
  }

  private registerPlugins() {
    this.server.register(mailgun);
    this.server.register(authenticate);
    this.server.register(document);

    this.server.register(import('under-pressure'), {
      maxEventLoopDelay: 1000, // maximum detected delay between event loop ticks.
      message: 'Under pressure!',
      retryAfter: 50,
    });
    this.server.register(import('fastify-helmet'), { contentSecurityPolicy: false });
    this.server.register(import('fastify-sensible'));
    this.server.register(import('fastify-cookie'));
    this.server.register(import('fastify-rate-limit'), {
      max: 100,
      timeWindow: MINUTE_IN_SECONDS,
      cache: 10000,
    });
    this.server.register(import('fastify-prettier'));
    this.server.register(import('fastify-cors'), { preflight: true, credentials: true });
    this.server.register(import('fastify-blipp'));
    this.server.register(import('fastify-qs'), { disabled: false });
    this.server.register(import('point-of-view'), {
      engine: { ejs },
      templates: join(__dirname, '..', 'templates'),
      options: { filename: resolve(__dirname, '..', 'templates') },
      includeViewExtension: true,
    });
  }

  private async registerRoutes() {
    this.server.register(require('fastify-autoload'), {
      dir: join(__dirname, 'routes'),
    });
  }
}
