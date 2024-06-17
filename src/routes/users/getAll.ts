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
    handler: async ({ query: { keyword, page, size } }, reply: FastifyReply) => {
      const users = await User.find({}, EXCLUDE_DATA)
        .lean()
        .catch((err) => reply.send(err));

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
