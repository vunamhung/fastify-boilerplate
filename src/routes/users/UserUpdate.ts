import { FastifyInstance, FastifyRequest } from 'fastify';
import validator from 'validator';
import User from '../../models/User';
import { hashPassword } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.put(
    '/:email',
    {
      preValidation: [server.authenticate, server.isRoot],
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
      let data = { ...request.body };

      if (data.password) data.password = await hashPassword(data.password);

      const result = await User.findOneAndUpdate({ email }, data).catch((err) => reply.send(err));

      if (result) reply.send({ success: true, message: `User ${email} updated.` });

      reply.notFound(`User ${email} not found.`);
    },
  );

  done();
}
