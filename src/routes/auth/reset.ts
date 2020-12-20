import { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
import User from '../../models/User';

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
        response: {
          200: {
            description: 'Password changed successfully',
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
      // @ts-ignore
      const { password, resetToken } = body;

      try {
        await jwt.verify(resetToken, process.env.RESET_PASSWORD_TOKEN_SECRET);

        let user = await User.findOne({ resetPasswordToken: resetToken });
        if (!user || !user.resetPasswordToken) return reply.badRequest('Token expired!');
        if (user.banned) reply.notAcceptable('You banned!');

        user.password = password;
        user.resetPasswordToken = undefined;
        await user.save();

        await user.generateRefreshToken();

        reply.send({ success: true, message: 'Password changed successfully. Please login with your new password.' });
      } catch ({ message }) {
        reply.badRequest(message);
      }
    },
  );

  done();
}
