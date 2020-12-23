import { FastifyInstance } from 'fastify';
import { uid } from 'rand-token';
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
              token: { type: 'string' },
            },
          },
        },
      },
    },
    async ({ body }, reply) => {
      try {
        // @ts-ignore
        const { auth, id: accessId } = server.jwt.decode(body.token);

        let { refreshToken, banned, id, email, role, verified } = await User.findById(accessId);

        if (banned) reply.notAcceptable('You banned!');
        if (!refreshToken) return reply.badRequest('Token expired.'); // check refresh token exists

        // @ts-ignore
        const { jti } = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        if (auth !== jti) return reply.badRequest('Token expired!');

        const token = await reply.jwtSign({ id, email, role, verified, auth: jti }, { expiresIn: '10m', jwtid: uid(6) });

        reply
          .setCookie('token', token, {
            path: '/',
            secure: !process.env.DEV_ENV, // send cookie over HTTPS only
            httpOnly: true,
            sameSite: true, // alternative CSRF protection
          })
          .send({ success: true, token });
      } catch ({ message }) {
        reply.badRequest(message);
      }
    },
  );

  done();
}
