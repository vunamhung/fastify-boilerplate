import fp from 'fastify-plugin';
import { preValidationHookHandler } from 'fastify';
import { containsAny, isNilOrEmpty } from '../utilities';

export default fp((fastify, options, done) => {
  const guard = (permissions) => async (request, reply) => {
    await request.jwtVerify();

    if (request.user.permissions.includes('root') || isNilOrEmpty(permissions) || process.env.DEV_ENV === 'true') return true;

    if (!containsAny(request.user.permissions, permissions)) {
      reply.forbidden('You are not allowed access here.');
    }
  };

  fastify.decorate('guard', guard);

  done();
});

declare module 'fastify' {
  export interface FastifyInstance {
    guard(permissions?: string[]): preValidationHookHandler;
  }
}
