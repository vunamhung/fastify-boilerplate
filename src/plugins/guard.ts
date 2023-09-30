import type { preValidationHookHandler } from 'fastify';
import { containsAny, env, isNilOrEmpty } from '~/utilities';
import fp from 'fastify-plugin';

export default fp((fastify, _, done) => {
  fastify.decorate('guard', (permissions) => async (request, reply) => {
    await request.jwtVerify();
    const allow = containsAny(request.user.permissions, permissions);

    if (!allow) return reply.forbidden('You are not allowed access here.');
    if (isNilOrEmpty(permissions) || env.isDev || request.user.permissions.includes('root') || allow) return true;
  });

  done();
});

declare module 'fastify' {
  export interface FastifyInstance {
    guard(permissions?: string[]): preValidationHookHandler;
  }
}
