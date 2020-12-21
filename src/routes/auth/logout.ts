import { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import { iToken } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.put(
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
        const { email, auth } = user as iToken;

        let checkUser = await User.findOne({ email });
        if (!checkUser || !checkUser.refreshToken) reply.badRequest('Token expired.');

        const { jti } = (await jwt.verify(checkUser.refreshToken, process.env.REFRESH_TOKEN_SECRET)) as iToken;

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
