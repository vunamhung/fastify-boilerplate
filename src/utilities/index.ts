import fp from 'fastify-plugin';
import { IStatusCodesInterface, statusCodes } from './statusCodes';

export interface IUtilities extends IStatusCodesInterface {}

export default fp((server, options, done) => {
  server.decorate('utils', { statusCodes });

  done(); // pass execution to the next middleware in fastify instance
});
