import { FastifyInstance, FastifyRequest } from 'fastify';
import { genSalt, hash } from 'bcryptjs';
import User from '../../models/User';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/reset',
    {
      schema: {
        tags: ['auth'],
        body: {
          type: 'object',
          properties: {
            password: { type: 'string' },
            token: { type: 'string' },
          },
          required: ['password', 'token'],
        },
      },
    },
    async (request: FastifyRequest, reply) => {
      // @ts-ignore
      const { password, token } = request.body;

      try {
        let user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) reply.badRequest('Your token has expired. Please attempt to reset your password again.');

        const salt = await genSalt(10);
        user.password = await hash(password, salt);

        await user.save();

        reply.code(200).send({
          success: true,
          message: 'Password changed successfully. Please login with your new password.',
        });
      } catch (error) {
        reply.send(error);
      }
    },
  );

  done();
}
