import { FastifyInstance } from 'fastify';

export default function (server: FastifyInstance, options, done) {
  server.get('/', { schema: { hide: true } }, async (request, reply) => reply.send({ date: new Date(), works: true }));

  done();
}
