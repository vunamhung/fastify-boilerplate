import { FastifyInstance } from 'fastify';
import User from '../../models/User';
import { iToken, verifyRefreshToken } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/logout',
    {
      preValidation: [server.authenticate],
      schema: {
        tags: ['auth'],
        security: [{ apiKey: [] }],
        summary: 'Sign out',
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
    async ({ user }, reply) => {
      try {
        const { id, auth } = user as iToken;

        let checkUser = await User.findById(id);
        if (!checkUser || !checkUser.refreshToken) reply.badRequest('Token expired.');

        const { jti } = verifyRefreshToken(checkUser.refreshToken);

        if (auth !== jti) reply.badRequest('Token expired!');

        checkUser.refreshToken = undefined;
        checkUser.save();

        reply.send({ success: true });
      } catch ({ message }) {
        reply.badRequest(message);
      }
    },
  );

  done();
}
