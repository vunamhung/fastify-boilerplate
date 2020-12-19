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
            verifyToken: { type: 'string' },
          },
          required: ['verifyToken'],
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
      const { verifyToken } = body;

      try {
        await jwt.verify(verifyToken, process.env.VERIFY_TOKEN_SECRET);

        let user = await User.findOne({ verifyToken });
        if (user.banned) reply.notAcceptable('You banned!');

        user.verifyToken = undefined;
        user.verified = true;

        await user.save();

        reply.send({ success: true, message: 'Email verify successfully. Thank you.' });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
