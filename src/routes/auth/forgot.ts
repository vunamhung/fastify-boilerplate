import { FastifyInstance } from 'fastify';
import { uid } from 'rand-token';
import { validate } from 'deep-email-validator';
import User from '../../models/User';
import { HOUR_IN_SECONDS, NOW_IN_SECONDS } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/forgot',
    {
      schema: {
        tags: ['auth'],
        summary: 'Send reset password link to user email.',
        body: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
          },
          required: ['email'],
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
      // @ts-ignore
      const { email } = body;

      const { valid, reason, validators } = await validate(email);

      if (!valid) return reply.badRequest(validators[reason]?.reason ?? 'Please provide a valid email address.');

      try {
        let user = await User.findOne({ email });
        if (!user) reply.badRequest('No user exist with this email.');

        user.resetPasswordToken = uid(64);
        user.resetPasswordExpires = NOW_IN_SECONDS + 4 * HOUR_IN_SECONDS;

        await user.save();

        reply.send({ success: true, message: 'Please check your email for the link to reset your password.' });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
