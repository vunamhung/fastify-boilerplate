import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export default fp((fastify: FastifyInstance, _, done) => {
  fastify.decorate('guard', (resource, operation) => async (request: FastifyRequest, reply: FastifyReply) => {
    await request.jwtVerify();
    if (fastify.rbac.can(request.user.role, resource, operation)) return true;
    return reply.forbidden('You are not allowed access here.');
  });

  done();
});

declare module 'fastify' {
  export interface FastifyInstance {
    guard(resource: string, operation?: string): any;
  }
}
