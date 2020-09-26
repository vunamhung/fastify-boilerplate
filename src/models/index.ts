import fp from 'fastify-plugin';
import { Model, connection, connect } from 'mongoose';

import { IVehicleModel, Vehicle } from './Vehicle';

export interface IModels {
  Vehicle: Model<IVehicleModel>;
}

export interface IDatabase {
  models: IModels;
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
    useFindAndModify: false,
  });

  const models: IModels = { Vehicle };

  server.decorate('db', { models });

  done();
});
