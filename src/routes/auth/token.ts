import type { FastifyReply } from 'fastify';
import type { ZFastify } from '~/@types';
import { cookieOptions, expiresIn } from '~/utils';

export default function (fastify: ZFastify, _, done) {
  fastify.route({
    method: 'GET',
    url: '/token',
    preValidation: fastify.guard(),
    schema: {
      tags: ['auth'],
      description: 'Generate access token',
      summary: 'Generate access token',
    },
    handler: async function ({ user: { id, jti: accessJti } }, reply: FastifyReply) {
      const dbUser = await fastify.user.get({ id });

      if (!dbUser?.refreshToken) return reply.notAcceptable('Token expired');

      const { jti, exp } = fastify.jwt.decode<iRefreshToken>(dbUser.refreshToken);

      if (exp < Date.now() / 1000) return reply.notAcceptable('Token expired.');
      if (jti !== accessJti) return reply.notAcceptable('Token expired!');

      const { email, fullName, role } = dbUser;
      const token = await reply.jwtSign({ id, email, fullName, role }, { expiresIn, jti });

      reply.setCookie('token', token, cookieOptions).send({ success: true, token });
    },
  });

  done();
}
