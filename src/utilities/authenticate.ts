import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export default fp((server: FastifyInstance, options, next) => {
  server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    await request.jwtVerify().catch((err) => reply.send(err));
  });

  next();
});
