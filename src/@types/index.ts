import { preValidationHookHandler } from 'fastify';
import { Messages } from 'mailgun-js';

declare module 'fastify' {
  interface FastifyInstance {
    guard: {
      role: Function;
      scope: Function;
    };
    authenticate: preValidationHookHandler;
    mailgun: Messages;
  }
}
