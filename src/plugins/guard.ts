import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ZFastify } from '~/@types';
import fp from 'fastify-plugin';
import { isBlank } from 'ramda-adjunct';

export default fp((fastify: ZFastify, _, done) => {
  fastify.decorate('guard', (resource, operation) => async (request: FastifyRequest, reply: FastifyReply) => {
    await request.jwtVerify();
    if (isBlank(resource)) return true;
    if (fastify.rbac.can(request.user.role, resource, operation)) return true;
    return reply.forbidden('You are not allowed access here.');
  });

  done();
});

declare module 'fastify' {
  export interface FastifyInstance {
    guard(resource?: string, operation?: string): any;
  }
}
