import { FastifyInstance } from 'fastify';
import { isEmpty } from 'ramda';
import { uid } from 'rand-token';
import { validate } from 'deep-email-validator';
import jwt from 'jsonwebtoken';
import { validatePassword } from '../../utilities';
import User from '../../models/User';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/',
    {
      preValidation: [server.guard.role('root'), server.authenticate],
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
      // @ts-ignore
      const { email, password, verified } = body;

      try {
        let user = await User.findOne({ email });

        if (user) return reply.badRequest('User already exists.');

        const { valid, reason, validators } = await validate(email);

        if (!valid) return reply.badRequest(validators[reason]?.reason ?? 'Please provide a valid email address.');

        const invalidPasswordMessage = await validatePassword(password);

        if (!isEmpty(invalidPasswordMessage)) {
          reply.code(400).send({ statusCode: 400, error: 'Bad Request', message: invalidPasswordMessage });
          return;
        }

        let newUser = await new User(body);
        const jwtid = uid(9);
        if (!verified) newUser.verifyToken = jwt.sign({}, process.env.VERIFY_TOKEN_SECRET, { expiresIn: '7d', jwtid });
        await newUser.save();

        reply.code(201).send({ success: true, message: 'User created.' });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
