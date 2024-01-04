import type { FastifyReply } from 'fastify';
import type { ZFastify } from '~/@types';
import { getLimit, READ } from '~/utilities';
import { z } from 'zod';

export default function (fastify: ZFastify, _, done) {
  fastify.route({
    method: 'GET',
    url: '/',
    preValidation: fastify.guard('user', READ),
    schema,
    handler: async ({ query: { keyword, page, size } }, reply: FastifyReply) => {
      const users = await fastify.user.search({ query: keyword, options: { LIMIT: getLimit(page, size) } });

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
    size: z.string().default('10'),
  }),
};
