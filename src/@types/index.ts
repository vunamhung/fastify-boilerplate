import { Messages } from 'mailgun-js';
import { IToken } from '../utilities/token';

declare module 'fastify' {
  export interface FastifyInstance {
    mailgun: Messages;
    authenticate: () => void;
    token: (request: FastifyRequest) => IToken;
    isAdmin: () => void;
  }
}
