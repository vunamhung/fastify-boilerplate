import { FastifyInstance } from 'fastify';
import Option from '../../models/Option';

export default function (server: FastifyInstance, options, done) {
  server.delete(
    '/:name',
    {
      preValidation: [server.authenticate],
      schema: {
        tags: ['options'],
        security: [{ apiKey: [] }],
        params: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'option name',
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        // @ts-ignore
        const { name } = request.params;

        await Option.deleteOne({ name });

        reply.send({
          success: true,
          message: `Option ${name} deleted`,
        });
      } catch (error) {
        reply.send(error);
      }
    },
  );

  done();
}
