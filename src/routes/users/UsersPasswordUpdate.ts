import { FastifyInstance } from 'fastify';
import { isEmpty } from 'ramda';
import { uid } from 'rand-token';
import User from '../../models/User';
import { iBody, signRefreshToken, validatePassword } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.put(
    '/password',
    {
      preValidation: [server.authenticate, server.guard.role('root', 'admin')],
      schema: {
        tags: ['users'],
        security: [{ apiKey: [] }],
        summary: 'Update password for user.',
        body: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            verifyPassword: { type: 'string' },
          },
          required: ['email', 'password', 'verifyPassword'],
        },
        response: {
          200: {
            description: 'Success',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async ({ body }, reply) => {
      const { email, password, verifyPassword } = body as iBody;

      const user = await User.findOne({ email });
      if (!user) reply.badRequest('User not found!');

      const invalidPasswordMessage = await validatePassword(password);
      if (!isEmpty(invalidPasswordMessage)) {
        return reply.code(400).send({ statusCode: 400, error: 'Bad Request', message: invalidPasswordMessage });
      }

      if (password !== verifyPassword) {
        return reply.badRequest("Passwords don't match");
      }

      user.password = password;
      user.refreshToken = signRefreshToken(uid(8));
      await user.save();

      reply.send({ success: true, message: `User '${email}' is updated password successful!` });
    },
  );

  done();
}
