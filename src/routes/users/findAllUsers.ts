import { FastifyInstance, FastifyRequest } from 'fastify';
import User from '../../models/User';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/',
    {
      preValidation: [server.authenticate, server.isAdmin],
      schema: {
        tags: ['users'],
        security: [{ apiKey: [] }],
        summary: 'Find all users.',
      },
    },
    async (request: FastifyRequest, reply) => {
      try {
        let user = await User.find();

        reply.send(user);
      } catch (error) {
        reply.send(error);
      }
    },
  );

  done();
}
