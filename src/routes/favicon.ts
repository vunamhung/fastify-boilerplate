import type { FastifyInstance } from 'fastify';

export default function (fastify: FastifyInstance, _: any, done: () => void) {
  fastify.get('/favicon.ico', { schema: { hide: true } }, (_, reply) => reply.notFound('Favicon'));

  done();
}
