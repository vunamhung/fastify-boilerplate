import { FastifyInstance, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

export default fp((server: FastifyInstance, options, next) => {
  server.decorate('isTrustMember', async (request, reply: FastifyReply) => {
    await request.jwtVerify().catch((err) => reply.send(err));

    const { verified } = server.token(request).user;

    if (!verified) reply.unauthorized('Account not verified so you are not allowed to make this request.');
  });

  next();
});