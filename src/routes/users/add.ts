import type { FastifyInstance } from 'fastify';
import { permissions } from '~/utilities';
import { genSaltSync, hashSync } from 'bcryptjs';
import { z } from 'zod';

export default function (fastify: FastifyInstance, _, done) {
  fastify.route({
    method: 'POST',
    url: '/',
    preValidation: fastify.guard([permissions.user.write]),
    schema: {
      tags: ['users'],
      security: [{ bearerAuth: [] }],
      body: z.object({
        id: z.string().max(32).toLowerCase(),
        email: z.string().email(),
        password: z.string().min(8).max(32),
        fullName: z.string(),
        verified: z.boolean().default(true),
      }),
    },
    handler: async ({ body }, reply) => {
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
