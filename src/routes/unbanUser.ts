import { FastifyInstance } from 'fastify';
import User from '../models/User';

export default function (server: FastifyInstance, options, done) {
  server.put(
    '/unban/:email',
    {
      preValidation: [server.guard.role('root', 'admin', 'ban'), server.authenticate],
      schema: {
        tags: ['ban'],
        security: [{ apiKey: [] }],
        summary: 'Unban user by email.',
        params: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
          },
        },
      },
    },
    async ({ params }, reply) => {
      // @ts-ignore
      const { email } = params;

      const user = await User.findOne({ email });

      user.banned = undefined;

      await user.save();

      reply.send({ success: true, message: `User ${email} is unban.` });
    },
  );

  done();
}
