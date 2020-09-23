import { config } from 'dotenv-flow';
import { install } from 'source-map-support';

install();
config();

import { fastify, FastifyInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

import fastifyBlipp from 'fastify-blipp';
import fastifyCors from 'fastify-cors';

import db from './models';

import statusRoutes from './routes/status';
import vehiclesRoutes from './routes/vehicles';
import errorThrowerRoutes from './routes/error';

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({ logger: true });

server.register(fastifyCors);
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
