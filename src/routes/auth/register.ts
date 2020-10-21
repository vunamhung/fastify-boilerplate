import { FastifyInstance } from 'fastify';
import { validate } from 'deep-email-validator';
import { uid } from 'rand-token';
import User from '../../models/User';
import { hashPassword } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/register',
    {
      schema: {
        tags: ['auth'],
        summary: 'Register a account.',
        body: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
          required: ['email', 'password'],
        },
      },
    },
    async ({ params, body }, reply) => {
      // @ts-ignore
      const { email, password } = body;

      try {
        let user = await User.findOne({ email });

        if (user) return reply.badRequest('User already exists.');

        const { valid, reason, validators } = await validate(email);

        user = new User({ email });

        if (!valid) return reply.badRequest(validators[reason]?.reason ?? 'Please provide a valid email address.');

        user.password = await hashPassword(password);
        user.refreshToken = uid(64);

        await user.save();

        reply.code(201).send({ success: true, message: 'User created.' });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
