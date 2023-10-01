import type { FastifyInstance } from 'fastify';
import validator from 'validator';

export default function (fastify: FastifyInstance, _, done) {
  fastify.get(
    '/token',
    {
      schema: {
        tags: ['auth'],
        description: 'Generate access token',
        summary: 'Generate access token',
      },
    },
    async function ({ cookies, headers: { authorization } }, reply) {
      const accessToken = authorization?.split(' ')[1] ?? cookies?.token;

      if (!validator.isJWT(accessToken)) return reply.badRequest('Wrong token format.');

      const decoded = fastify.jwt.decode(accessToken) as iToken;

      if (!decoded) return reply.badRequest('Wrong token format!');
      if (!decoded?.auth) return reply.badRequest('Wrong token auth!');

      const user = await fastify.user.get({ id: decoded.id });

      if (!user?.refreshToken) return reply.notAcceptable('Token expired.');

      const { jti } = fastify.jwt.decode(user.refreshToken) as iRefreshToken;

      if (decoded.auth !== jti) return reply.notAcceptable('Token expired!');

      const { id, email, fullName, permissions } = user;

      const payload = { id, email, fullName, permissions, auth: decoded.auth };
      const token = await reply.jwtSign(payload, { expiresIn: '10m', jti: fastify.nano.id(6) });

      reply.send({ success: true, token });
    },
  );

  done();
}
