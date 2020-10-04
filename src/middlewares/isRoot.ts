import { FastifyInstance, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import '../@types';

export default fp((server: FastifyInstance, options, next) => {
  server.decorate('isRoot', async (request, reply: FastifyReply) => {
    const { role } = server.token(request).user;

    if (role !== 'root') reply.unauthorized('You are not allowed to make this request.');
  });

  next();
});
