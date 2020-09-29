import { IModels } from '../models';
import { IUtilities } from '../utilities';

declare module 'fastify' {
  export interface FastifyInstance {
    models: IModels;
    utils: IUtilities;
    authenticate: () => void;
  }
}
