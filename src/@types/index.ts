import { Db } from 'models';

declare module 'fastify' {
  export interface FastifyInstance {
    db: Db;
  }
}
