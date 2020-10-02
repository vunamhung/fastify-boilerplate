import { FastifyInstance, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

export default fp((server: FastifyInstance, options, done) => {
  server.decorate('isAdmin', async (request, reply: FastifyReply) => {
    const { role } = server.token(request).user;

    if (role !== 'admin') reply.unauthorized('You are not allowed to make this request.');
  });

  done();
});
