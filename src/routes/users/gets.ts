import type { FastifyInstance } from 'fastify';
import { permissions } from '~/utilities';
import { z } from 'zod';

export default function (fastify: FastifyInstance, _, done) {
  fastify.route({
    method: 'GET',
    url: '/',
    preValidation: fastify.guard([permissions.user.read]),
    schema,
    handler: async ({ query: { keyword, page, limit } }, reply) => {
      const users = await fastify.user.search({ query: keyword || '*', options: { LIMIT: { from: page, size: limit } } });

      reply.send(users);
    },
  });
  done();
}

const schema = {
  tags: ['users'],
  security: [{ bearerAuth: [] }],
  querystring: z.object({
    keyword: z.string().optional(),
    page: z.string().default('1'),
    limit: z.string().default('10'),
  }),
};
