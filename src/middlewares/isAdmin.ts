import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export default fp((server: FastifyInstance, options, done) => {
  server.decorate('isAdmin', async (request: FastifyRequest, reply: FastifyReply) => {
    let token: { user };

    token = request.cookies.token
      ? server.jwt.decode(request.cookies.token)
      : await server.jwt.decode(request.headers.authorization?.split(' ')[1]);

    const { role } = token.user;

    if (role !== 'admin') reply.unauthorized('You are not allowed to make this request.');
  });

  done();
});
