import type { FastifyReply } from 'fastify';
import type { ZFastify } from '~/@types';
import { z } from 'zod';

export default function (fastify: ZFastify, _: any, done: () => void) {
  fastify.route({
    method: 'POST',
    url: '/login',
    schema: {
      tags: ['auth'],
      description: 'Authentication endpoint, for all the users, to allow access to protected resources',
      summary: 'Sign in',
      body: z.object({
        name: z.string().min(4),
      }),
    },
    handler: async ({ body: { name } }, reply: FastifyReply) => {
      return {};
    },
  });

  done();
}
