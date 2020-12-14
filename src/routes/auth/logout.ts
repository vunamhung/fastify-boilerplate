import { FastifyInstance } from 'fastify';
import Token from '../../models/Token';

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
        await Token.findOneAndDelete({ token: refreshToken });

        reply.send({ success: true });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
