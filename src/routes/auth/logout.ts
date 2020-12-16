import { FastifyInstance } from 'fastify';
import User from '../../models/User';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/logout',
    {
      schema: {
        tags: ['auth'],
        description: 'Logout',
        summary: 'Sign out',
        body: {
          type: 'object',
          properties: {
            refreshToken: { type: 'string' },
          },
          required: ['refreshToken'],
        },
        response: {
          200: {
            description: 'Success',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
            },
          },
        },
      },
    },
    async ({ body }, reply) => {
      try {
        // @ts-ignore
        const { refreshToken } = body;
        let user = await User.findOne({ refreshToken });
        if (!user) reply.notAcceptable('Wrong token');
        user.refreshToken = undefined;
        user.save();

        reply.send({ success: true });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
