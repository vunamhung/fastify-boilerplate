import { preValidationHookHandler } from 'fastify';
import { Messages } from 'mailgun-js';
import { iToken } from '../utilities/token';

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: preValidationHookHandler;
    isAdmin: preValidationHookHandler;
    mailgun: Messages;
    token(request: FastifyRequest): iToken;
  }
}
