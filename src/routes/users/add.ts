import type { FastifyInstance, FastifyReply } from 'fastify';
import { CREATE } from '~/utilities';
import { genSaltSync, hashSync } from 'bcryptjs';
import { z } from 'zod';

export default function (fastify: FastifyInstance, _, done) {
  fastify.route({
    method: 'POST',
    url: '/',
    preValidation: fastify.guard('user', CREATE),
    schema,
    handler: async ({ body }, reply: FastifyReply) => {
      const { id, password = fastify.nano.id(12), verified } = body;

      let existUser = await fastify.user.get({ id });
      if (existUser) return reply.conflict(`User ID '${id}' already in use.`);

      const hashPassword = hashSync(password, genSaltSync(10));
      const signupToken = !verified && (await reply.jwtSign({}, { expiresIn: '7d', jti: fastify.nano.id(4) }));
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
