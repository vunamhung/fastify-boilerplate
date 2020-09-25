import { join } from 'path';
import { fastify, FastifyInstance } from 'fastify';
import http from 'http';

import db from './models';
import utilities from './utilities';
import authenticate from './middlewares/authenticate';
import { swaggerOpts, rateLimitOpts, staticOpts } from './utilities/pluginConfigs';

export default class Server {
  private server: FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>;
  private port: number | string;

  constructor() {
    this.port = process.env.PORT || 3000;
    this.server = fastify({ ignoreTrailingSlash: true, logger: { level: 'fatal' } });

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

  private registerPlugins() {
    this.server.register(db, { uri: process.env.MONGO_URI });
    this.server.register(utilities);
    this.server.register(authenticate);

    this.server.register(import('under-pressure'), {
      maxEventLoopDelay: 1000, // maximum detected delay between event loop ticks.
      message: 'Under pressure!',
      retryAfter: 50,
    });
    this.server.register(import('fastify-url-data'));
    this.server.register(import('fastify-rate-limit'), rateLimitOpts);
    this.server.register(import('fastify-prettier'));
    this.server.register(import('fastify-swagger'), swaggerOpts);
    this.server.register(import('fastify-boom'));
    this.server.register(import('fastify-cors'));
    this.server.register(import('fastify-blipp'));
    this.server.register(import('fastify-no-icon'));
    this.server.register(import('fastify-static'), staticOpts);
  }

  private async registerRoutes() {
    this.server.register(require('fastify-autoload'), {
      dir: join(__dirname, 'routes'),
    });
  }
}
