import type { FastifyInstance, FastifyReply } from 'fastify';
import { cookieOptions, env } from '~/utilities';
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
    handler: async function ({ cookies, headers: { authorization } }, reply: FastifyReply) {
      const accessToken = authorization?.split(' ')[1] ?? cookies?.token;

      if (!validator.isJWT(accessToken)) return reply.badRequest('Wrong token format.');

      const decodedAccessToken = fastify.jwt.decode<iUserToken>(accessToken);

      if (!decodedAccessToken) return reply.badRequest('Wrong token format!');
      if (!decodedAccessToken?.jti) return reply.badRequest('Wrong token auth!');

      const user = await fastify.user.get({ id: decodedAccessToken.id });

      if (!user?.refreshToken) return reply.notAcceptable('Token expired.');

      const { jti } = fastify.jwt.decode<iRefreshToken>(user.refreshToken);

      if (!jti || decodedAccessToken.jti !== jti) return reply.notAcceptable('Token expired!');

      const { id, email, fullName, role } = user;

      const token = await reply.jwtSign({ id, email, fullName, role }, { expiresIn: env.isDev ? '60d' : '10m', jti });

      reply.setCookie('token', token, cookieOptions).send({ success: true, token });
    },
  });

  done();
}
