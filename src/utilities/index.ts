import fp from 'fastify-plugin';
import { IJWTToken, JWTToken } from './token';
import { IStatusCodesInterface, statusCodes } from './statusCodes';

export interface IUtilities extends IJWTToken, IStatusCodesInterface {}

export default fp((server, options, done) => {
  server.decorate('utils', { ...JWTToken, statusCodes });

  done(); // pass execution to the next middleware in fastify instance
});
