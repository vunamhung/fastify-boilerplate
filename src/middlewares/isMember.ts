import { FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export default fp((server, options, next) => {
  server.decorate('isMember', async (request: FastifyRequest, reply) => {
    await request.jwtVerify().catch((err) => reply.send(err));
  });

  next();
});
