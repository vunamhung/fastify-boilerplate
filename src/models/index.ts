import fp from 'fastify-plugin';
import mysql from 'mysql2/promise';

export interface IModels {
  products;
}

export interface IDatabase {
  models: IModels;
}

export default fp(async (server, options, done) => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  server.decorate('db', connection);

  done();
});
