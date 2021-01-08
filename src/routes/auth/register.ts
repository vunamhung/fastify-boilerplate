import { FastifyInstance } from 'fastify';
import validator from 'validator';
import { validate } from 'deep-email-validator';
import { isEmpty } from 'ramda';
import { uid } from 'rand-token';
import User from '../../models/User';
import { iBody, signSignupToken, validatePassword } from '../../utilities';

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
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            preValidate: { type: 'boolean' },
          },
          required: ['email', 'password'],
        },
      },
    },
    async ({ params, body }, reply) => {
      const { email, password, preValidate } = body as iBody;

      try {
        let user = await User.findOne({ email });

        if (user) return reply.badRequest('User already exists.');

        if (preValidate) {
          const { valid, reason, validators } = await validate(email);

          if (!valid) return reply.badRequest(validators[reason]?.reason ?? 'Please provide a valid email address.');

          const invalidPasswordMessage = await validatePassword(password);

          if (!isEmpty(invalidPasswordMessage)) {
            return reply.code(400).send({ statusCode: 400, error: 'Bad Request', message: invalidPasswordMessage });
          }
        } else {
          if (!validator.isEmail(email)) return reply.badRequest('You must enter an email address.');
        }

        let newUser = await new User(body);
        newUser.signupToken = signSignupToken(uid(9));
        await newUser.save();

        reply.code(201).send({ success: true, message: 'User created.' });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
