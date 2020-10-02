import { FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export default fp((server, options, done) => {
  server.decorate('authenticate', async (request: FastifyRequest, reply) => {
    await request.jwtVerify().catch((error) => reply.send(error));
  });

  done();
});
