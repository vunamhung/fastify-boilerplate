import { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import { iBody, verifySignupToken } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/verify',
    {
      schema: {
        tags: ['auth'],
        description: 'Verify email address.',
        summary: 'Verify email address.',
        body: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            id: { type: 'string' },
          },
          required: ['email', 'id'],
        },
        response: {
          200: {
            description: 'Email verify successfully',
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
      const { email, id } = body as iBody;

      try {
        let user = await User.findOne({ email });
        if (!user) return reply.badRequest('Token expired.');
        if (user.banned) reply.notAcceptable('You banned!');
        if (user.verified) reply.badRequest('User verified!');

        const { jti } = verifySignupToken(user.signupToken);
        if (id !== jti) reply.badRequest('Token Expired!');

        user.signupToken = undefined;
        user.verified = true;

        await user.save();

        reply.send({ success: true, message: 'Email verify successfully. Thank you.' });
      } catch ({ message }) {
        reply.badRequest(message);
      }
    },
  );

  done();
}
