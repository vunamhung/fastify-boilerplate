import type { FastifyReply } from 'fastify';
import type { ZFastify } from '~/@types';
import User from '~/models/User';
import { EXCLUDE_DATA, getLimit, READ } from '~/utils';
import { z } from 'zod';

export default function (fastify: ZFastify, _, done) {
  fastify.route({
    method: 'GET',
    url: '/',
    preValidation: fastify.guard('user', READ),
    schema,
    handler: async ({ query: { keyword, page, limit } }, reply: FastifyReply) => {
      const users = await User.paginate({}, { limit: Number(limit), page: Number(page), lean: true });

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
