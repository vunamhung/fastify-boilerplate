import { join, resolve } from 'path';
import { fastify, FastifyInstance } from 'fastify';
import * as http from 'http';

import fastifySwagger from 'fastify-swagger';
import fastifyBlipp from 'fastify-blipp';
import fastifyCors from 'fastify-cors';
import fastifyStatic from 'fastify-static';

import db from './models';

import statusRoutes from './routes/status';
import vehiclesRoutes from './routes/vehicles';

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
    this.server.register(fastifySwagger, {
      routePrefix: '/documentation',
      swagger: {
        info: {
          title: 'Test swagger',
          description: 'testing the fastify swagger api',
          version: '0.1.0',
        },
        externalDocs: {
          url: 'https://swagger.io',
          description: 'Find more info here',
        },
        host: 'localhost',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [
          { name: 'user', description: 'User related end-points' },
          { name: 'code', description: 'Code related end-points' },
        ],
        securityDefinitions: {
          apiKey: {
            type: 'apiKey',
            name: 'apiKey',
            in: 'header',
          },
        },
      },
      exposeRoute: true,
    });
    this.server.register(fastifyCors);
    this.server.register(fastifyBlipp);
    this.server.register(fastifyStatic, {
      root: join(__dirname, '..', '..', 'public'),
      prefix: '/',
      wildcard: false,
    });
    this.server.register(db, { uri: process.env.DB_URI });
  }

  private registerRoutes() {
    this.server.register(vehiclesRoutes);
    this.server.register(statusRoutes);
  }
}
