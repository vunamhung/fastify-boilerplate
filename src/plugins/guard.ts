import type { FastifyReply, FastifyRequest } from 'fastify';
import { containsAny, env } from '~/utilities';
import fp from 'fastify-plugin';
import { isNilOrEmpty } from 'ramda-adjunct';

export default fp((fastify, _, done) => {
  fastify.decorate('guard', (permissions) => async (request: FastifyRequest, reply: FastifyReply) => {
    await request.jwtVerify();
    if (isNilOrEmpty(permissions) || env.isDev) return true;
    const allow = containsAny(request.user.permissions, permissions);
    if (allow || request.user.permissions.includes('root')) return true;
    return reply.forbidden('You are not allowed access here.');
  });

  done();
});

declare module 'fastify' {
  export interface FastifyInstance {
    guard(permissions?: string[]): any;
  }
}
