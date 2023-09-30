import type { ZFastify } from '~/@types';
import { z } from 'zod';

export default function (fastify: ZFastify, _: any, done: () => void) {
  fastify.route({
    method: 'POST',
    url: '/login',
    schema: {
      tags: ['auth'],
      body: z.object({
        username: z.string().max(32).toLowerCase().describe('Some description for username'),
        password: z.string().max(32).nonempty().optional().describe('Some description for password'),
      }),
    },
    handler: async ({ body: { username, password } }, reply) => {
      console.log({ username, password });
      return reply.send('OK');
    },
  });

  done();
}
