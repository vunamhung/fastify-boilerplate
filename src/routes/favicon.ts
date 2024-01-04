import type { ZFastify } from '~/@types';

export default function (fastify: ZFastify, _, done) {
  fastify.get('/favicon.ico', { schema: { hide: true } }, (_, reply) => reply.notFound('Favicon'));

  done();
}
