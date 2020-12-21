import { FastifyInstance } from 'fastify';
import User from '../models/User';
import { iParams } from '../utilities';

export default function (server: FastifyInstance, options, done) {
  server.put(
    '/ban/:email',
    {
      preValidation: [server.authenticate, server.guard.role('root', 'ban')],
      schema: {
        tags: ['ban'],
        security: [{ apiKey: [] }],
        summary: 'Ban user by email.',
        params: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
          },
        },
      },
    },
    async ({ params }, reply) => {
      const { email } = params as iParams;

      const user = await User.findOne({ email });

      user.banned = true;
      user.refreshToken = undefined;

      await user.save();

      reply.send({ success: true, message: `User ${email} is banned.` });
    },
  );

  done();
}
