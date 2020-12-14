import { FastifyInstance } from 'fastify';
import Token from '../../models/Token';

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
        // check token exists
        let tokenDoc = await Token.findOne({ token: refreshToken });
        if (!tokenDoc) reply.badRequest('Access denied, token missing!');

        if (!tokenDoc) {
          return reply.badRequest('Token expired!');
        } else {
          //extract payload from refresh token and generate a new access token and send it
          const { user } = await server.jwt.verify(tokenDoc.token);

          const accessToken = await reply.jwtSign({ user }, { expiresIn: '10m' });

          reply.send({ success: true, accessToken });
        }
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
