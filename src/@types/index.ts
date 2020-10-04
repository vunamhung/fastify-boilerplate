import { preValidationHookHandler } from 'fastify';
import { HttpErrorReplys } from 'fastify-sensible/lib/httpError';
import { Messages } from 'mailgun-js';
import { iToken } from '../utilities/token';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: preValidationHookHandler;
    isRoot: preValidationHookHandler;
    isAdmin: preValidationHookHandler;
    isVerified: preValidationHookHandler;
    mailgun: Messages;
    token(request): iToken;
  }

  interface FastifyReply extends HttpErrorReplys {}
}
