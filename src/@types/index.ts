import { IDatabase } from '../models';
import { IUtilities } from '../utilities';

declare module 'fastify' {
  export interface FastifyInstance {
    db: IDatabase;
    utils: IUtilities;
    authenticate: () => void;
  }
}
