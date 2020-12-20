import { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
import User from '../../models/User';

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
      // @ts-ignore
      const { email, id } = body;

      try {
        let user = await User.findOne({ email });
        if (!user || !user.refreshToken) return reply.badRequest('Token expired.');
        if (user.banned) reply.notAcceptable('You banned!');
        if (user.verified) reply.badRequest('User verified!');

        // @ts-ignore
        const { jti } = await jwt.verify(user.verifyToken, process.env.VERIFY_TOKEN_SECRET);
        if (id !== jti) reply.badRequest('Token Expired!');

        user.verifyToken = undefined;
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
