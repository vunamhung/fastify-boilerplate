import { FastifyInstance } from 'fastify';
import validator from 'validator';
import User from '../../models/User';
import { hashPassword } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.put(
    '/:email',
    {
      preValidation: [server.isRoot],
      schema: {
        tags: ['users'],
        summary: 'Update user by email.',
        params: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
          },
        },
      },
    },
    async ({ params, body }, reply) => {
      // @ts-ignore
      const { email } = params;

      if (!validator.isEmail(email)) reply.badRequest('Please provide a valid email');

      // @ts-ignore
      let data = { ...body };

      if (data.password) data.password = await hashPassword(data.password);

      const result = await User.findOneAndUpdate({ email }, data).catch((err) => reply.send(err));

      if (result) reply.send({ success: true, message: `User ${email} updated.` });

      reply.notFound(`User ${email} not found.`);
    },
  );

  done();
}
