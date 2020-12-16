import { FastifyInstance } from 'fastify';
import User from '../../models/User';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/me',
    {
      preValidation: [server.guard.role('root', 'admin', 'member'), server.authenticate],
      schema: {
        tags: ['users'],
        security: [{ apiKey: [] }],
        summary: 'Find me.',
      },
    },
    async (request, reply) => {
      const { id } = server.decodedToken(request)?.user;

      const user = await User.findById(id, { password: 0, refreshToken: 0 }).catch((err) => reply.send(err));

      reply.send(user);
    },
  );

  done();
}
