import { FastifyInstance, FastifyRequest } from 'fastify';

export default function (server: FastifyInstance, options, done) {
  server.get('/logout', {}, async (request: FastifyRequest, reply) => {
    reply.clearCookie('token');

    reply.code(200).send();
  });

  done();
}
