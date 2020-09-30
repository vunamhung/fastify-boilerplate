import { Messages } from 'mailgun-js';

declare module 'fastify' {
  export interface FastifyInstance {
    mailgun: Messages;
    authenticate: () => void;
  }
}
