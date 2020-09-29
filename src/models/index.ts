import fp from 'fastify-plugin';
import { Model, connection, connect } from 'mongoose';

import { IVehicleModel, Vehicle } from './Vehicle';
import { IProductModel, Product } from './Product';

export interface IModels {
  Vehicle: Model<IVehicleModel>;
  Product: Model<IProductModel>;
}

export default fp(async (server, options, done) => {
  connection.on('connected', () => {
    server.log.info({ actor: 'MongoDB' }, 'connected');
  });

  connection.on('disconnected', () => {
    server.log.error({ actor: 'MongoDB' }, 'disconnected');
  });

  await connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  const models: IModels = { Vehicle, Product };

  server.decorate('models', models);

  done();
});
