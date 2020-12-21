import { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import { iToken } from '../../utilities/token';
import { iBody } from '../../utilities';

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
            token: { type: 'string' },
          },
          required: ['token'],
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
        const { token } = body as iBody;
        const { email, auth } = server.jwt.decode(token);

        let user = await User.findOne({ email });
        if (!user || !user.refreshToken) reply.badRequest('Token expired.');

        const { jti } = (await jwt.verify(user.refreshToken, process.env.REFRESH_TOKEN_SECRET)) as iToken;

        if (auth !== jti) reply.badRequest('Token expired!');

        user.refreshToken = undefined;
        user.save();

        reply.send({ success: true });
      } catch ({ message }) {
        reply.badRequest(message);
      }
    },
  );

  done();
}
