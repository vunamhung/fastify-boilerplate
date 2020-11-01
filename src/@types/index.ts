import { Messages } from 'mailgun-js';
import { iToken } from '../utilities/token';

declare module 'fastify' {
  interface FastifyInstance {
    guard: {
      role: Function;
      scope: Function;
    };
    mailgun: Messages;
    token(request): iToken;
  }
}
