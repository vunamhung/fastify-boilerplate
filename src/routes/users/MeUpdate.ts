import { FastifyInstance } from 'fastify';
import User from '../../models/User';

export default function (server: FastifyInstance, options, done) {
  server.put(
    '/me',
    {
      preValidation: [server.guard.role('root', 'admin', 'member', 'user:write'), server.authenticate],
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

      await User.findOneAndUpdate({ email }, request.body).catch((err) => reply.send(err));

      reply.send({ success: true, message: `User '${email}' is updated.` });
    },
  );

  done();
}
