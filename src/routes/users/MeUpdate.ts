import { FastifyInstance } from 'fastify';
import User from '../../models/User';
import { iToken } from '../../utilities/token';

export default function (server: FastifyInstance, options, done) {
  server.put(
    '/me',
    {
      preValidation: [server.authenticate, server.guard.role('root', 'admin', 'member', 'user:write')],
      schema: {
        tags: ['users'],
        security: [{ apiKey: [] }],
        summary: 'Update me.',
        body: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'Success',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async ({ user, body }, reply) => {
      const { email } = user as iToken;

      await User.findOneAndUpdate({ email }, body).catch((err) => reply.send(err));

      reply.send({ success: true, message: `User '${email}' is updated.` });
    },
  );

  done();
}
