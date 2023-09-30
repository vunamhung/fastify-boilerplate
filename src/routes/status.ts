import type { FastifyInstance } from 'fastify';

export default function (fastify: FastifyInstance, _: any, done: () => void) {
  fastify.get('/', { schema: { hide: true } }, (_, reply) => reply.send({ date: new Date(), works: true }));

  done();
}
