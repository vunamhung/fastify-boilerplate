import { IUtilities } from 'utilities';
import { Connection } from 'mysql2/promise';

declare module 'fastify' {
  export interface FastifyInstance {
    db: Connection;
    utils: IUtilities;
    authenticate: () => void;
  }
}
