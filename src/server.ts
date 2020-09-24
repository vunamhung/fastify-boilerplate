import { fastify, FastifyInstance } from 'fastify';
import * as fastifyBoom from 'fastify-boom';
import * as http from 'http';

import fastifyRateLimit from 'fastify-rate-limit';
import fastifyPrettier from 'fastify-prettier';
import fastifySwagger from 'fastify-swagger';
import fastifyBlipp from 'fastify-blipp';
import fastifyCors from 'fastify-cors';
import fastifyStatic from 'fastify-static';

import db from './models';
import routes from './routes';
import utilities from './utilities';
import { swaggerOpts, rateLimitOpts, staticOpts } from './utilities/data';

export default class Server {
  private server: FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>;
  private port: number | string;

  constructor() {
    this.port = process.env.PORT || 5000;
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
    this.server.register(db, { uri: process.env.DB_URI });
    this.server.register(utilities);

    this.server.register(fastifyRateLimit, rateLimitOpts);
    this.server.register(fastifyPrettier, { fallbackOnError: false });
    this.server.register(fastifySwagger, swaggerOpts);
    this.server.register(fastifyBoom);
    this.server.register(fastifyCors);
    this.server.register(fastifyBlipp);
    this.server.register(fastifyStatic, staticOpts);
  }

  private registerRoutes() {
    routes.map((route) => this.server.register(route));
  }
}
