import { preValidationHookHandler } from 'fastify';
import { Messages } from 'mailgun-js';
import { iToken } from '../utilities/token';

declare module 'fastify' {
  interface FastifyInstance {
    guard: {
      role: Function;
      scope: Function;
    };
    authenticate: preValidationHookHandler;
    mailgun: Messages;
    decodedToken(request): iToken;
  }
}
