import type { ZFastify } from '~/@types';

export default function (fastify: ZFastify, _, done) {
  fastify.get('/', { schema: { hide: true } }, (_, reply) => reply.send({ date: new Date(), works: true }));

  done();
}
