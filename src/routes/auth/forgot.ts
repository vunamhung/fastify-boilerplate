import { FastifyInstance } from 'fastify';
import validator from 'validator';
import User from '../../models/User';
import { uid } from 'rand-token';
import { iBody, signResetPasswordToken } from '../../utilities';

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
      const { email } = body as iBody;

      if (!validator.isEmail(email)) return reply.badRequest('You must enter an email address.');

      try {
        let user = await User.findOne({ email });
        if (!user) reply.badRequest('No user exist with this email.');
        if (user.banned) reply.notAcceptable('You banned!');

        user.resetPasswordToken = signResetPasswordToken(uid(7));

        await user.save();

        reply.send({ success: true, message: 'Please check your email for the link to reset your password.' });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
