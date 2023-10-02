import type { FastifyInstance } from 'fastify';
import { permissions, searchParameters } from '~/utilities';
import { Type } from '@sinclair/typebox';

export default function (fastify: FastifyInstance, _, done) {
  fastify.route({
    method: 'GET',
    url: '/',
    preValidation: fastify.guard([permissions.user.read]),
    schema,
    handler: async ({ query: { keyword, page, limit } }, reply) => {
      const users = await fastify.user.search({ query: keyword || '*', parameters: searchParameters(page, limit) });
      if (users.total === 0) return reply.notFound();

      reply.send(users);
    },
  });
  done();
}

const schema = {
  tags: ['users'],
  security: [{ apiKey: [] }],
  querystring: Type.Object({
    keyword: Type.String(),
    page: Type.Number({ default: 1 }),
    limit: Type.Number({ default: 10 }),
  }),
};
