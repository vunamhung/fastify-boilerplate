import { FastifyInstance } from 'fastify';
import { isEmpty } from 'ramda';
import { compare } from 'bcryptjs';
import User from '../../models/User';
import { iBody, iToken, validatePassword } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.put(
    '/me/password',
    {
      preValidation: [server.authenticate, server.guard.role('root', 'admin', 'member', 'user:write')],
      schema: {
        tags: ['users'],
        security: [{ apiKey: [] }],
        summary: 'User self update password.',
        body: {
          type: 'object',
          properties: {
            oldPassword: { type: 'string' },
            newPassword: { type: 'string' },
            verifyNewPassword: { type: 'string' },
          },
          required: ['oldPassword', 'newPassword', 'verifyNewPassword'],
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
    async ({ user, body }, reply) => {
      const { email, id } = user as iToken;

      const { oldPassword, newPassword, verifyNewPassword } = body as iBody;

      const me = await User.findById(id);

      // compare password with db user password
      const isMatch = await compare(oldPassword, me.password);
      if (!isMatch) reply.badRequest('Invalid Credentials.');
      if (oldPassword === newPassword) reply.badRequest('New password must have not same as old one!');

      const invalidPasswordMessage = await validatePassword(newPassword);
      if (!isEmpty(invalidPasswordMessage)) {
        return reply.code(400).send({ statusCode: 400, error: 'Bad Request', message: invalidPasswordMessage });
      }

      if (newPassword !== verifyNewPassword) {
        return reply.badRequest("Passwords don't match");
      }

      me.password = newPassword;
      await me.save();

      reply.send({ success: true, message: `User '${email}' is updated password successful!` });
    },
  );

  done();
}
