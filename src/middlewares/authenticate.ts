import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export default fp((server: FastifyInstance, options, done) => {
  server.decorate('isRoot', async (request: FastifyRequest, reply: FastifyReply) => {
    await request.jwtVerify().catch((err) => reply.send(err));

    const { role } = server.token(request).user;

    if (role !== 'root') reply.unauthorized('You are not allowed to make this request.');
  });

  server.decorate('isAdmin', async (request: FastifyRequest, reply: FastifyReply) => {
    await request.jwtVerify().catch((err) => reply.send(err));

    const { role } = server.token(request).user;

    if (role !== 'admin' && role !== 'root') reply.unauthorized('You are not allowed to make this request.');
  });

  server.decorate('isTrustMember', async (request, reply: FastifyReply) => {
    await request.jwtVerify().catch((err) => reply.send(err));

    const { verified } = server.token(request).user;

    if (!verified) reply.unauthorized('Account not verified so you are not allowed to make this request.');
  });

  server.decorate('isMember', async (request: FastifyRequest, reply) => {
    await request.jwtVerify().catch((err) => reply.send(err));
  });

  done();
});
