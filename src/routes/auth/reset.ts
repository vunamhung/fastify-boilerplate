import { FastifyInstance } from 'fastify';
import User from '../../models/User';
import { hashPassword } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/reset',
    {
      schema: {
        tags: ['auth'],
        description: 'Reset forgotten user password. An autogenerated password will be sent to the supplied email address.',
        summary: 'Reset user password',
        body: {
          type: 'object',
          properties: {
            password: { type: 'string' },
            resetToken: { type: 'string' },
          },
          required: ['password', 'resetToken'],
        },
      },
    },
    async ({ body }, reply) => {
      // @ts-ignore
      const { password, resetToken } = body;

      try {
        let user = await User.findOne({ resetPasswordToken: resetToken, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) reply.badRequest('Your token has expired. Please attempt to reset your password again.');

        user.password = await hashPassword(password);

        await user.save();

        reply.send({ success: true, message: 'Password changed successfully. Please login with your new password.' });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
