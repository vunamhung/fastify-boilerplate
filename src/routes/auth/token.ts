import type { FastifyInstance, FastifyReply } from 'fastify';
import { cookieOptions, expiresIn } from '~/utilities';

export default function (fastify: FastifyInstance, _, done) {
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

      if (!dbUser?.refreshToken) return reply.notAcceptable('Token expired.');

      const { jti } = fastify.jwt.decode<iRefreshToken>(dbUser.refreshToken);

      if (jti !== accessJti) return reply.notAcceptable('Token expired!');

      const { email, fullName, role } = dbUser;
      const token = await reply.jwtSign({ id, email, fullName, role }, { expiresIn, jti });

      reply.setCookie('token', token, cookieOptions).send({ success: true, token });
    },
  });

  done();
}
