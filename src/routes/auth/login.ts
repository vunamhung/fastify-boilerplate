import type { FastifyInstance, FastifyReply } from 'fastify';
import { cookieOptions, expiresIn } from '~/utilities';
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

      const { email, fullName, role } = user;

      const jti = nanoid(15);
      const refreshToken = await reply.jwtSign({}, { expiresIn: '30d', jti });
      const token = await reply.jwtSign({ id, email, fullName, role }, { expiresIn, jti });

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
