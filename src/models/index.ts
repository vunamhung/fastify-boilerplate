import fp from 'fastify-plugin';
import { Model, connection, connect } from 'mongoose';

import { VehicleModel, Vehicle } from './Vehicle';

export interface Models {
  Vehicle: Model<VehicleModel>;
}

export interface Db {
  models: Models;
}

export default fp(async (server, options: { uri: string }, done) => {
  connection.on('connected', () => {
    server.log.info({ actor: 'MongoDB' }, 'connected');
  });

  connection.on('disconnected', () => {
    server.log.error({ actor: 'MongoDB' }, 'disconnected');
  });

  await connect(options.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
  });

  const models: Models = {
    Vehicle: Vehicle,
  };

  server.decorate('db', { models });

  done();
});
