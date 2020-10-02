import { FastifyInstance, FastifyRequest } from 'fastify';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/logout',
    {
      preValidation: [server.authenticate],
      schema: {
        tags: ['auth'],
        security: [{ apiKey: [] }],
        summary: 'Logged out user',
      },
    },
    async (request: FastifyRequest, reply) => {
      reply.clearCookie('token');

      reply.send({ success: true, message: 'Logged out' });
    },
  );

  done();
}
