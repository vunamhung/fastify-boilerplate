import type { FastifyReply } from 'fastify';
import type { ZFastify } from '~/@types';
import { CREATE } from '~/utilities';
import { genSaltSync, hashSync } from 'bcryptjs';
import { nanoid } from 'nanoid';
import { z } from 'zod';

export default function (fastify: ZFastify, _, done) {
  fastify.route({
    method: 'POST',
    url: '/',
    preValidation: fastify.guard('user', CREATE),
    schema,
    handler: async ({ body }, reply: FastifyReply) => {
      const { id, password = nanoid(12), verified } = body;

      let existUser = await fastify.user.get({ id });
      if (existUser) return reply.conflict(`User ID '${id}' already in use.`);

      const hashPassword = hashSync(password, genSaltSync(10));
      const signupToken = !verified && (await reply.jwtSign({}, { expiresIn: '7d', jti: nanoid(8) }));
      await fastify.user.set({ id, data: { ...body, password: hashPassword, signupToken }, timestamp: true });

      reply.code(201).success('User created.');
    },
  });
  done();
}

const schema = {
  tags: ['users'],
  summary: 'Add new user',
  security: [{ bearerAuth: [] }],
  body: z.object({
    id: z.string().max(32).toLowerCase(),
    email: z.string().email(),
    password: z.string().min(8).max(32),
    fullName: z.string(),
    role: z.string(),
    verified: z.boolean().default(true),
  }),
};
