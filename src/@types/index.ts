import { preValidationHookHandler } from 'fastify';
import { Messages } from 'mailgun-js';
import { iToken } from '../utilities/token';

declare module 'fastify' {
  interface FastifyInstance {
    isRoot: preValidationHookHandler;
    isAdmin: preValidationHookHandler;
    isTrustMember: preValidationHookHandler;
    isMember: preValidationHookHandler;
    mailgun: Messages;
    token(request): iToken;
  }
}
