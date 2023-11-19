import type { FastifyInstance } from 'fastify';
import { roles } from '~/utilities';
import RBAC from 'fast-rbac';
import fp from 'fastify-plugin';

export default fp((fastify: FastifyInstance, _, done) => {
  fastify.decorate('rbac', new RBAC({ roles }));
  done();
});

declare module 'fastify' {
  export interface FastifyInstance {
    rbac: RBAC;
  }
}
