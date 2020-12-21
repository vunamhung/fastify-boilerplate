import { FastifyInstance } from 'fastify';
import User from '../../models/User';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/me',
    {
      preValidation: [server.guard.role('root', 'admin', 'member'), server.authenticate],
      schema: {
        tags: ['users'],
        security: [{ apiKey: [] }],
        summary: 'Find me.',
        response: {
          200: {
            description: 'Success',
            type: 'object',
            properties: {
              email: { type: 'string' },
              role: { type: 'string' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              avatar: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = server.decodedToken(request)?.user;

      const user = await User.findById(id).catch((err) => reply.send(err));

      reply.send(user);
    },
  );

  done();
}
