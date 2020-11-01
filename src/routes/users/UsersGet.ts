import { FastifyInstance } from 'fastify';
import User from '../../models/User';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/',
    {
      preValidation: server.guard.role('root'),
      schema: {
        tags: ['users'],
        security: [{ apiKey: [] }],
        summary: 'Find all users.',
      },
    },
    async (request, reply) => {
      const users = await User.find().catch((err) => reply.send(err));

      reply.send(users);
    },
  );

  done();
}
