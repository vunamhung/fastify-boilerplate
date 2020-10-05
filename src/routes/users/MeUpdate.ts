import { FastifyInstance } from 'fastify';
import User from '../../models/User';
import { hashPassword } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.put(
    '/me',
    {
      preValidation: [server.authenticate],
      schema: {
        tags: ['users'],
        summary: 'Update me.',
        params: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
          },
        },
      },
    },
    async (request, reply) => {
      const { email } = server.token(request).user;

      // @ts-ignore
      let data = { ...request.body };

      if (data.password) data.password = await hashPassword(data.password);

      await User.findOneAndUpdate({ email }, data).catch((err) => reply.send(err));

      reply.send({ success: true, message: 'user is updated' });
    },
  );

  done();
}
