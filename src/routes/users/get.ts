import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

export default function (fastify: FastifyInstance, _, done) {
  fastify.route({
    method: 'GET',
    url: '/:id',
    preValidation: fastify.guard(['user:read']),
    schema,
    handler: async ({ params: { id } }, reply) => {
      const user = await fastify.user.get({ id });
      if (!user) return reply.notFound(`This user '${id}' is not found.`);

      reply.send(user);
    },
  });

  done();
}

const schema = {
  tags: ['users'],
  summary: 'Get an user info',
  security: [{ bearerAuth: [] }],
  params: z.object({
    id: z.string().max(32).toLowerCase(),
  }),
  response: {
    200: z.object({
      id: z.string(),
      email: z.string(),
      fullName: z.string(),
      permissions: z.string().array(),
    }),
  },
};
