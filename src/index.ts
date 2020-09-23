import * as dotenv from 'dotenv-flow';
import * as sourceMapSupport from 'source-map-support';

sourceMapSupport.install();
dotenv.config();

import * as fastify from 'fastify';
import * as fastifyBlipp from 'fastify-blipp';
import { Server, IncomingMessage, ServerResponse } from 'http';
import statusRoutes from './routes/status';
import vehiclesRoutes from './routes/vehicles';
import errorThrowerRoutes from './routes/error-thrower';
import db from './db';

const server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({ logger: true });

server.register(fastifyBlipp);
server.register(db, { uri: process.env.DB_URI });
server.register(vehiclesRoutes);
server.register(statusRoutes);
server.register(errorThrowerRoutes);

const start = async () => {
  try {
    await server.listen(3000, 'localhost');
    server.blipp();
  } catch (err) {
    console.log(err);
    server.log.error(err);
    process.exit(1);
  }
};

process.on('uncaughtException', (error) => {
  console.error(error);
});
process.on('unhandledRejection', (error) => {
  console.error(error);
});

start();
