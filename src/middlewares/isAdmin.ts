import { FastifyInstance, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

export default fp((server: FastifyInstance, options, next) => {
  server.decorate('isAdmin', async (request, reply: FastifyReply) => {
    const { role } = server.token(request).user;

    if (role !== 'admin' && role !== 'root') reply.unauthorized('You are not allowed to make this request.');
  });

  next();
});
