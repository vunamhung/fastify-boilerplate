import { FastifyInstance } from 'fastify';
import Option from '../../models/Option';
import { iParams } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.delete(
    '/:name',
    {
      preValidation: [server.authenticate, server.guard.role('root', 'option:write')],
      schema: {
        tags: ['options'],
        security: [{ apiKey: [] }],
        summary: 'Delete a option by name.',
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
    async ({ params }, reply) => {
      const { name } = params as iParams;

      const result = await Option.findOneAndDelete({ name }).catch((err) => reply.send(err));

      if (result) reply.send({ success: true, message: `Option ${name} deleted.` });

      reply.notFound(`Option ${name} not found.`);
    },
  );

  done();
}
