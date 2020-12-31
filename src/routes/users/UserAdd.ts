import { FastifyInstance } from 'fastify';
import { isEmpty } from 'ramda';
import { uid } from 'rand-token';
import { validate } from 'deep-email-validator';
import User from '../../models/User';
import { iBody, signSignupToken, validatePassword } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/',
    {
      preValidation: [server.authenticate, server.guard.role('root')],
      schema: {
        tags: ['users'],
        security: [{ apiKey: [] }],
        summary: 'Add new user.',
        body: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            verified: { type: 'boolean' },
            role: { type: 'array' },
          },
          required: ['email', 'password'],
        },
      },
    },
    async ({ params, body }, reply) => {
      const { email, password, verified } = body as iBody;

      try {
        let user = await User.findOne({ email });

        if (user) return reply.badRequest('User already exists.');

        const { valid, reason, validators } = await validate(email);

        if (!valid) return reply.badRequest(validators[reason]?.reason ?? 'Please provide a valid email address.');

        const invalidPasswordMessage = await validatePassword(password);

        if (!isEmpty(invalidPasswordMessage)) {
          return reply.code(400).send({ statusCode: 400, error: 'Bad Request', message: invalidPasswordMessage });
        }

        let newUser = await new User(body);
        if (!verified) newUser.signupToken = signSignupToken(uid(9));
        await newUser.save();

        reply.code(201).send({ success: true, message: 'User created.' });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
