import { Messages } from 'mailgun-js';
import { iToken } from '../utilities/token';

declare module 'fastify' {
  export interface FastifyInstance {
    mailgun: Messages;
    authenticate: () => void;
    token: (request: FastifyRequest) => iToken;
    isAdmin: () => void;
  }
}
