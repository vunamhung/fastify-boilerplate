import type { FastifyInstance, FastifyReply } from 'fastify';
import { cookieOptions, env } from '~/utilities';
import { compareSync } from 'bcryptjs';
import { nanoid } from 'nanoid';
import { z } from 'zod';

export default function (fastify: FastifyInstance, _, done) {
  fastify.route({
    method: 'POST',
    url: '/login',
    schema,
    handler: async ({ body: { id, password } }, reply: FastifyReply) => {
      let user = await fastify.user.get({ id });
      if (!user) return reply.badRequest('Invalid Credentials');

      const isMatch = compareSync(password, user.password);
      if (!isMatch) return reply.badRequest('Invalid Credentials!');

      const { email, fullName, permissions } = user;

      const refreshTokenId = nanoid(15);
      const refreshToken = await reply.jwtSign({}, { expiresIn: '30d', jti: refreshTokenId });
      const payload = { id, email, fullName, permissions };
      const token = await reply.jwtSign(payload, { expiresIn: env.isDev ? '60d' : '10m', jti: refreshTokenId });

      reply.setCookie('token', token, cookieOptions).send({ success: true, token });

      await fastify.user.set({ id, path: '$.refreshToken', data: refreshToken });
    },
  });

  done();
}

const schema = {
  tags: ['auth'],
  description: 'Authentication endpoint, for all the users, to allow access to protected resources',
  summary: 'Sign in to access protected resources',
  body: z.object({
    id: z.string().max(32).toLowerCase().describe('Some description for username'),
    password: z.string().max(32).describe('Some description for password'),
  }),
};
