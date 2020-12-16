import { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
import User from '../../models/User';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/refresh_token',
    {
      schema: {
        tags: ['auth'],
        description: 'Generate access token',
        summary: 'Generate access token',
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
              accessToken: { type: 'string' },
            },
          },
        },
      },
    },
    async ({ body }, reply) => {
      try {
        // @ts-ignore
        const { refreshToken } = body;

        let existUser = await User.findOne({ refreshToken });
        if (!existUser) return reply.badRequest('Token expired!'); // check token exists

        // @ts-ignore
        const { user } = await jwt.verify(existUser.refreshToken, process.env.REFRESH_TOKEN_SECRET); // extract payload from refresh token

        const accessToken = await reply.jwtSign({ user });

        reply.send({ success: true, accessToken });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
