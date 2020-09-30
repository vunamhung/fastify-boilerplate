import { FastifyInstance } from 'fastify';

export default function (server: FastifyInstance, options, done) {
  server.route({
    url: '/status',
    logLevel: 'warn',
    method: ['GET', 'HEAD'],
    handler: async (request, reply) => reply.send({ date: new Date(), works: true }),
  });

  done();
}
