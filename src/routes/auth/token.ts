import type { FastifyInstance } from 'fastify';
import validator from 'validator';

export default function (fastify: FastifyInstance, _, done) {
  fastify.route({
    method: 'GET',
    url: '/token',
    schema: {
      tags: ['auth'],
      description: 'Generate access token',
      summary: 'Generate access token',
    },
    handler: async function ({ cookies, headers: { authorization } }, reply) {
      const accessToken = authorization?.split(' ')[1] ?? cookies?.token;

      if (!validator.isJWT(accessToken)) return reply.badRequest('Wrong token format.');

      const decodedAccessToken = fastify.jwt.decode<iToken>(accessToken);

      if (!decodedAccessToken) return reply.badRequest('Wrong token format!');
      if (!decodedAccessToken?.auth) return reply.badRequest('Wrong token auth!');

      const user = await fastify.user.get({ id: decodedAccessToken.id });

      if (!user?.refreshToken) return reply.notAcceptable('Token expired.');

      const { jti } = fastify.jwt.decode<iRefreshToken>(user.refreshToken);

      if (decodedAccessToken.auth !== jti) return reply.notAcceptable('Token expired!');

      const { id, email, fullName, permissions } = user;

      const token = await reply.jwtSign(
        { id, email, fullName, permissions, auth: decodedAccessToken.auth },
        { expiresIn: '10m', jti: fastify.nano.id(6) },
      );

      reply.send({ success: true, token });
    },
  });

  done();
}
