import { FastifyInstance } from 'fastify';
import User from '../../models/User';
import { iToken } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/me',
    {
      preValidation: [server.authenticate, server.guard.role('root', 'admin', 'member')],
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
              address: { type: 'array' },
              avatar: { type: 'string' },
            },
          },
        },
      },
    },
    async ({ user }, reply) => {
      const { id } = user as iToken;

      const me = await User.findById(id).catch((err) => reply.send(err));

      reply.send(me);
    },
  );

  done();
}
