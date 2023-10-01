import type { FastifyInstance } from 'fastify';
import type { iToken } from './users';
import validator from 'validator';

export default function (fastify: FastifyInstance, options, done) {
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

      const decoded: iToken = this.jwt.decode(accessToken);

      if (!decoded) return reply.badRequest('Wrong token format!');
      if (!decoded?.auth) return reply.badRequest('Wrong token auth!');

      const user = await this.user.get({ id: decoded.id });

      if (!user?.refreshToken) return reply.notAcceptable('Token expired.');

      const { jti } = this.jwt.decode(user.refreshToken);

      if (decoded.auth !== jti) return reply.notAcceptable('Token expired!');

      const { id, email, fullName, permissions, verified, store } = user;

      const payload = { id, email, fullName, permissions, verified, store, auth: decoded.auth };
      const token = await reply.jwtSign(payload, { expiresIn: '10m', jwtid: this.nano.id(6) });

      reply.send({ success: true, token });
    },
  );

  done();
}
