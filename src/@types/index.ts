import { preValidationHookHandler } from 'fastify';
import { Messages } from 'mailgun-js';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: preValidationHookHandler;
    mailgun: Messages;
  }
}
