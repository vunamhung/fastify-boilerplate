import { FastifyInstance } from 'fastify';
import Option from '../../models/Option';

export default function (server: FastifyInstance, options, done) {
  server.delete(
    '/:name',
    {
      preValidation: [server.isRoot],
      schema: {
        tags: ['options'],
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
      // @ts-ignore
      const { name } = params;

      const result = await Option.findOneAndDelete({ name }).catch((err) => reply.send(err));

      if (result) reply.send({ success: true, message: `Option ${name} deleted.` });

      reply.notFound(`Option ${name} not found.`);
    },
  );

  done();
}
