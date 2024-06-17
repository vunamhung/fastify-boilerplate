import type { FastifyReply } from 'fastify';
import type { ZFastify } from '~/@types';
import User from '~/models/User';
import { CREATE, validatePassword } from '~/utilities';
import { nanoid } from 'nanoid';
import { isBlank } from 'ramda-adjunct';
import { z } from 'zod';

export default function (fastify: ZFastify, _, done) {
  fastify.route({
    method: 'POST',
    url: '/',
    preValidation: fastify.guard('user', CREATE),
    schema,
    handler: async ({ body }, reply: FastifyReply) => {
      const { _id, password = nanoid(12), verified } = body;

      let existUser = await User.findById(_id);
      if (existUser) return reply.badRequest(`ID '${_id}' already exists.`);

      const invalidPasswordMessage = await validatePassword(password);

      if (!isBlank(invalidPasswordMessage)) return reply.badRequest(invalidPasswordMessage.join(','));

      let newUser = new User({ ...body, password });
      if (!verified) newUser.signupToken = await reply.jwtSign({}, { expiresIn: '7d', jti: nanoid(8) });
      await newUser.save();

      reply.code(201).success('User created.');
    },
  });

  done();
}

const schema = {
  tags: ['users'],
  summary: 'Add new user',
  security: [{ bearerAuth: [] }],
  body: z.object({
    _id: z.string().max(32).toLowerCase(),
    email: z.string().email(),
    password: z.string().min(8).max(32).optional(),
    fullName: z.string(),
    role: z.string(),
    verified: z.boolean().default(true),
  }),
};
