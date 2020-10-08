import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export default fp((server: FastifyInstance, options, next) => {
  server.decorate('isRoot', async (request: FastifyRequest, reply: FastifyReply) => {
    await request.jwtVerify().catch((err) => reply.send(err));

    const { role } = server.token(request).user;

    if (role !== 'root') reply.forbidden('You are not allowed to make this request.');
  });

  next();
});
