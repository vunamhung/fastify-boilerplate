import { FastifyInstance, FastifyRequest } from 'fastify';
import { uniq } from 'ramda';
import Option from '../models/Option';

export default function (server: FastifyInstance, options, done) {
  server.put(
    '/ban/:email',
    {
      preValidation: [server.authenticate, server.isAdmin],
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
    async (request: FastifyRequest, reply) => {
      // @ts-ignore
      const { email } = request.params;

      const banUsers = await Option.findOne({ name: 'ban_users' });

      banUsers.data = [...banUsers.data, email];

      banUsers.data = uniq(banUsers.data);

      await banUsers.save();

      reply.send({ success: true, message: `User ${email} is banned.` });
    },
  );

  done();
}
