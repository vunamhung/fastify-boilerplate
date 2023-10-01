import type { FastifyInstance } from 'fastify';
import { isEmpty } from 'ramda';
import validator from 'validator';
import { Type } from '@sinclair/typebox';
import { genSaltSync, hashSync } from 'bcryptjs';
import { permissions, validatePassword } from '~/utilities';

export default function (fastify: FastifyInstance, _, done) {
  fastify.route({
    method: 'POST',
    url: '/',
    preValidation: fastify.guard([permissions.user.write]),
    schema,
    handler: async ({ body }, reply) => {
      const { id, email, password = fastify.nano.id(12), verified } = body;

      let existUser = await fastify.user.get({ id });
      if (existUser) return reply.conflict(`User ID '${id}' already in use.`);

      if (!validator.isEmail(email)) return reply.badRequest('You must enter valid email address.');

      const invalidMessage = validatePassword(password);

      if (!isEmpty(invalidMessage)) return reply.badRequest(invalidMessage);

      const hashPassword = hashSync(password, genSaltSync(10));
      const signupToken = !verified && (await reply.jwtSign({}, { expiresIn: '7d', jti: fastify.nano.id(4) }));
      await fastify.user.set({ id, data: { ...body, password: hashPassword, signupToken }, timestamp: true });

      reply.code(201).success('User created.');
    },
  });
  done();
}

export const schema = {
  tags: ['users'],
  security: [{ apiKey: [] }],
  body: Type.Object({
    id: Type.String({ minLength: 3, maxLength: 100 }),
    email: Type.String(),
    password: Type.String({ minLength: 3, maxLength: 100 }),
    fullName: Type.String(),
    permissions: Type.Array(Type.String()),
    verified: Type.Boolean(),
  }),
};
