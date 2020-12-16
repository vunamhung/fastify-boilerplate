import { FastifyInstance } from 'fastify';
import validator from 'validator';
import User from '../../models/User';

export default function (server: FastifyInstance, options, done) {
  server.put(
    '/:email',
    {
      preValidation: [server.guard.role('root', 'user:write'), server.authenticate],
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
        body: {
          type: 'object',
          properties: {
            password: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'array' },
          },
        },
      },
    },
    async ({ params, body }, reply) => {
      // @ts-ignore
      const { email } = params;

      if (!validator.isEmail(email)) reply.badRequest('Please provide a valid email');

      const result = await User.findOneAndUpdate({ email }, body).catch((err) => reply.send(err));

      if (result) reply.send({ success: true, message: `User ${email} updated.` });

      reply.notFound(`User ${email} not found.`);
    },
  );

  done();
}
