import { fastify, FastifyInstance } from 'fastify';
import * as http from 'http';

import fastifyBlipp from 'fastify-blipp';
import fastifyCors from 'fastify-cors';

import db from './models';

import statusRoutes from './routes/status';
import vehiclesRoutes from './routes/vehicles';
import errorThrowerRoutes from './routes/error';

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

    console.log('Server listening on', this.server.server.address());
    process.on('uncaughtException', console.error);
    process.on('unhandledRejection', console.error);
  }

  private registerPlugins() {
    this.server.register(fastifyCors);
    this.server.register(fastifyBlipp);
    this.server.register(db, { uri: process.env.DB_URI });
  }

  private registerRoutes() {
    this.server.register(vehiclesRoutes);
    this.server.register(statusRoutes);
    this.server.register(errorThrowerRoutes);
  }
}
