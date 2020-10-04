import { FastifyInstance, FastifyRequest } from 'fastify';
import User from '../../models/User';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/',
    {
      preValidation: [server.authenticate, server.isRoot],
      schema: {
        tags: ['users'],
        security: [{ apiKey: [] }],
        summary: 'Find all users.',
      },
    },
    async (request: FastifyRequest, reply) => {
      const user = await User.find().catch((err) => reply.send(err));

      reply.send(user);
    },
  );

  done();
}
