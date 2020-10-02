import { FastifyInstance, FastifyRequest } from 'fastify';
import User from '../../models/User';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/me',
    {
      preValidation: [server.authenticate],
      schema: {
        tags: ['users'],
        security: [{ apiKey: [] }],
        summary: 'Find me',
      },
    },
    async (request: FastifyRequest, reply) => {
      const { id } = server.token(request).user;

      try {
        let user = await User.findById(id, { password: 0, refreshToken: 0 });

        reply.send(user);
      } catch (error) {
        reply.send(error);
      }
    },
  );

  done();
}
