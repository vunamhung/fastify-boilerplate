import { FastifyInstance } from 'fastify';
import { isEmpty } from 'ramda';
import { compare } from 'bcryptjs';
import User from '../../models/User';
import { validatePassword } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.put(
    '/me/password',
    {
      preValidation: [server.guard.role('root', 'admin', 'member', 'user:write'), server.authenticate],
      schema: {
        tags: ['users'],
        security: [{ apiKey: [] }],
        summary: 'Update password.',
        body: {
          type: 'object',
          properties: {
            oldPassword: { type: 'string' },
            newPassword: { type: 'string' },
          },
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
    async (request, reply) => {
      const { email } = server.decodedToken(request)?.user;

      // @ts-ignore
      const { oldPassword, newPassword } = request.body;

      const user = await User.findOne({ email });

      // compare password with db user password
      const isMatch = await compare(oldPassword, user.password);
      if (!isMatch) reply.badRequest('Invalid Credentials.');
      if (oldPassword === newPassword) reply.badRequest('New password must have not same as old one!');

      const invalidPasswordMessage = await validatePassword(newPassword);
      if (!isEmpty(invalidPasswordMessage)) {
        reply.code(400).send({ statusCode: 400, error: 'Bad Request', message: invalidPasswordMessage });
        return;
      }

      user.password = newPassword;
      await user.save();

      reply.send({ success: true, message: `User '${email}' is updated password successful!` });
    },
  );

  done();
}
