import { IUtilities } from '../utilities';

declare module 'fastify' {
  export interface FastifyInstance {
    utils: IUtilities;
    authenticate: () => void;
  }
}
