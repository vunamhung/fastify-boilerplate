import type { FastifyInstance } from 'fastify';
import { cookieOptions, env } from '~/utilities';
import { z } from 'zod';

export default function (fastify: FastifyInstance, _, done) {
  fastify.route({
    method: 'POST',
    url: '/login',
    schema: {
      tags: ['auth'],
      description: 'Authentication endpoint, for all the users, to allow access to protected resources',
      summary: 'Sign in to access protected resources',
      body: z.object({
        id: z.string().max(32).toLowerCase().describe('Some description for username'),
        password: z.string().max(32).nonempty().optional().describe('Some description for password'),
      }),
    },
    handler: async ({ body: { id, password } }, reply) => {
      const refreshTokenId = fastify.nano.id(5);
      const refreshToken = await reply.jwtSign({}, { expiresIn: '30d', jti: refreshTokenId });
      const payload = { id, permissions: ['root'], auth: refreshTokenId };
      const token = await reply.jwtSign(payload, { expiresIn: env.isDev ? '60d' : '10m', jti: fastify.nano.id(6) });

      reply.setCookie('token', token, cookieOptions).send({ success: true, token });
      await fastify.user.set({ id, data: refreshToken });
    },
  });

  done();
}
