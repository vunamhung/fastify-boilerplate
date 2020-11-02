import { FastifyInstance } from 'fastify';
import User from '../../models/User';
import { hashPassword } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.put(
    '/me',
    {
      preValidation: server.guard.role('root', 'admin', 'member', 'user:write'),
      schema: {
        tags: ['users'],
        security: [{ apiKey: [] }],
        summary: 'Update me.',
        body: {
          type: 'object',
          properties: {
            password: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
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

      reply.send({ success: true, message: `User '${email}' is updated.` });
    },
  );

  done();
}
