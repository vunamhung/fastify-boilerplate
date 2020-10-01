import { FastifyInstance, FastifyRequest } from 'fastify';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/logout',
    {
      preValidation: [server.authenticate],
      schema: {
        tags: ['auth'],
        hide: true,
        security: [{ apiKey: [] }],
      },
    },
    async (request: FastifyRequest, reply) => {
      reply.clearCookie('token');

      reply.code(200).send({
        success: true,
        message: 'Logged out',
      });
    },
  );

  done();
}
