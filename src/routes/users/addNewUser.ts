import { FastifyInstance, FastifyRequest } from 'fastify';
import { genSalt, hash } from 'bcryptjs';
import { uid } from 'rand-token';
import User from '../../models/User';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/',
    {
      preValidation: [server.authenticate],
      schema: {
        tags: ['users'],
        security: [{ apiKey: [] }],
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
    async (request: FastifyRequest, reply) => {
      // @ts-ignore
      const { email, password } = request.body;

      try {
        let user = await User.findOne({ email });

        if (user) reply.badRequest('User already exists.');

        user = new User({ email });

        const salt = await genSalt(10);
        user.password = await hash(password, salt);
        user.refreshToken = uid(64);

        await user.save();

        reply.status(201).send({ success: true, message: 'User created.' });
      } catch (error) {
        reply.send(error);
      }
    },
  );

  done();
}
