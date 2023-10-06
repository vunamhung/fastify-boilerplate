import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { containsAny, env } from '~/utilities';
import fp from 'fastify-plugin';
import { isNilOrEmpty } from 'ramda-adjunct';

export default fp((fastify: FastifyInstance, _, done) => {
  fastify.decorate('guard', (permissions) => async ({ jwtVerify, user }: FastifyRequest, reply: FastifyReply) => {
    await jwtVerify();
    if (isNilOrEmpty(permissions) || env.isDev) return true;
    const allow = containsAny(user.permissions, permissions);
    if (allow || user.permissions.includes('root')) return true;
    return reply.forbidden('You are not allowed access here.');
  });

  done();
});

declare module 'fastify' {
  export interface FastifyInstance {
    guard(permissions?: string[]): any;
  }
}
