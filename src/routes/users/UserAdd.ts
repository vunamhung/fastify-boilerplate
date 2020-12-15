import { FastifyInstance } from 'fastify';
import { uid } from 'rand-token';
import User from '../../models/User';
import { hashPassword } from '../../utilities';

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

        if (user) reply.badRequest(`User '${email}' already exists.`);

        user = new User({ email });

        user.password = await hashPassword(password);
        user.refreshToken = uid(64);

        await user.save();

        reply.code(201).send({ success: true, message: `User '${email}' created.` });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
