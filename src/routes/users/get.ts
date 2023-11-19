import type { FastifyInstance, FastifyReply } from 'fastify';
import { READ } from '~/utilities';
import { z } from 'zod';

export default function (fastify: FastifyInstance, _, done) {
  fastify.route({
    method: 'GET',
    url: '/:id',
    preValidation: fastify.guard('user', READ),
    schema,
    handler: async ({ params: { id } }, reply: FastifyReply) => {
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
      role: z.string(),
    }),
  },
};
