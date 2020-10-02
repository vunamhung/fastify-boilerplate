import { FastifyInstance, FastifyRequest } from 'fastify';
import { genSalt, hash } from 'bcryptjs';
import validator from 'validator';
import User from '../../models/User';

export default function (server: FastifyInstance, options, done) {
  server.put(
    '/:email',
    {
      preValidation: [server.authenticate, server.isAdmin],
      schema: {
        tags: ['users'],
        security: [{ apiKey: [] }],
        summary: 'Update user by email.',
        params: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply) => {
      // @ts-ignore
      const { email } = request.params;

      if (!validator.isEmail(email)) reply.badRequest('Please provide a valid email');

      // @ts-ignore
      let user = { ...request.body };

      if (user.password) {
        const salt = await genSalt();
        user.password = await hash(user.password, salt);
      }

      await User.findOneAndUpdate({ email }, user).catch((err) => reply.send(err));

      reply.send({ success: true, message: 'user is updated' });
    },
  );

  done();
}
