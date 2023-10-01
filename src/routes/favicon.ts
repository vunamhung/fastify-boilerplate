import type { FastifyInstance } from 'fastify';

export default function (fastify: FastifyInstance, _, done) {
  fastify.get('/favicon.ico', { schema: { hide: true } }, (_, reply) => reply.notFound('Favicon'));

  done();
}
