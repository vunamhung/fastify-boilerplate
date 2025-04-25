import type { ZFastify } from '~/@types';
import { roles } from '~/utils';
import RBAC from 'fast-rbac';
import fp from 'fastify-plugin';

export default fp((fastify: ZFastify, _, done) => {
  fastify.decorate('rbac', new RBAC({ roles }));
  done();
});

declare module 'fastify' {
  export interface FastifyInstance {
    rbac: RBAC;
  }
}
