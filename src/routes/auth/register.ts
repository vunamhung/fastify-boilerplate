import { FastifyInstance } from 'fastify';
import { validate } from 'deep-email-validator';
import { isEmpty } from 'ramda';
import { uid } from 'rand-token';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import { validatePassword } from '../../utilities';

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

        if (!valid) return reply.badRequest(validators[reason]?.reason ?? 'Please provide a valid email address.');

        const message = await validatePassword(password);

        if (!isEmpty(message)) {
          reply.code(400).send({ success: false, message });
          return;
        }

        let newUser = await new User(body);
        const jwtid = uid(9);
        newUser.verifyToken = jwt.sign({}, process.env.VERIFY_TOKEN_SECRET, { expiresIn: '7d', jwtid });
        await newUser.save();

        reply.code(201).send({ success: true, message: 'User created.' });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
