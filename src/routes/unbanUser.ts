import { FastifyInstance } from 'fastify';
import { uniq } from 'ramda';
import Option from '../models/Option';

export default function (server: FastifyInstance, options, done) {
  server.put(
    '/unban/:email',
    {
      preValidation: server.guard.role('root', 'admin', 'ban'),
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

      const banUsers = await Option.findOne({ name: 'ban_users' });

      banUsers.data = banUsers.data.filter((banEmail) => banEmail !== email);

      banUsers.data = uniq(banUsers.data);

      await banUsers.save();

      reply.send({ success: true, message: `User ${email} is unban.` });
    },
  );

  done();
}
