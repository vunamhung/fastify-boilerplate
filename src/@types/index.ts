import { IUtilities } from '../utilities';
import { Messages } from 'mailgun-js';

declare module 'fastify' {
  export interface FastifyInstance {
    utils: IUtilities;
    mailgun: Messages;
    authenticate: () => void;
  }
}
