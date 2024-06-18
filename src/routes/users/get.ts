import type { FastifyReply } from 'fastify';
import type { ZFastify } from '~/@types';
import User from '~/models/User';
import { READ } from '~/utils';
import { z } from 'zod';

export default function (fastify: ZFastify, _, done) {
  fastify.route({
    method: 'GET',
    url: '/:username',
    preValidation: fastify.guard('user', READ),
    schema,
    handler: async ({ params: { username } }, reply: FastifyReply) => {
      const user = await User.findOne({ username });
      if (!user) return reply.notFound(`This user '${username}' is not found.`);

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
    username: z.string().max(32).toLowerCase(),
  }),
  response: {
    200: z.object({
      username: z.string(),
      email: z.string(),
      fullName: z.string(),
      role: z.string(),
    }),
  },
};
