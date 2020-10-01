import { FastifyInstance, FastifyRequest } from 'fastify';
import { uid } from 'rand-token';
import validator from 'validator';
import User from '../../models/User';
import { HOUR_IN_SECONDS } from '../../utilities/constants';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/forgot',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            email: { type: 'string' },
          },
          required: ['email'],
        },
      },
    },
    async (request: FastifyRequest, reply) => {
      // @ts-ignore
      const { email } = request.body;

      if (!validator.isEmail(email)) reply.badRequest('You must enter an email address.');

      try {
        let user = await User.findOne({ email });
        if (!user) reply.badRequest('No user exist with this email.');

        user.resetPasswordToken = uid(64);
        user.resetPasswordExpires = Date.now() + 4 * HOUR_IN_SECONDS;

        await user.save();

        reply.code(200).send({
          success: true,
          message: 'Please check your email for the link to reset your password.',
        });
      } catch (error) {
        reply.send(error);
      }
    },
  );

  done();
}