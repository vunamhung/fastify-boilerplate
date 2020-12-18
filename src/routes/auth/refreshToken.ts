import { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import { uid } from 'rand-token';
import { iToken } from '../../utilities/token';

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
            accessToken: { type: 'string' },
          },
          required: ['accessToken'],
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
        const { accessToken } = body;

        // @ts-ignore
        const { user: accessUser } = server.jwt.decode(accessToken);
        let existUser = await User.findOne({ email: accessUser.email });
        // check refresh token exists
        if (!existUser || !existUser.refreshToken) return reply.badRequest('Token expired!');

        // @ts-ignore
        const { user, jti } = await jwt.verify(existUser.refreshToken, process.env.REFRESH_TOKEN_SECRET); // extract payload from refresh token

        if (accessUser.auth !== jti) return reply.badRequest('Token expired!');

        reply.send({ success: true, accessToken: await reply.jwtSign({ user }, { expiresIn: '10m', jwtid: uid(6) }) });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
