import type { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';

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
  security: [{ apiKey: [] }],
  params: Type.Object({
    id: Type.String(),
  }),
};
