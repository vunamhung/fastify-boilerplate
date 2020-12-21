import { FastifyInstance } from 'fastify';
import { uniq } from 'ramda';
import Option from '../../models/Option';

export default function (server: FastifyInstance, options, done) {
  server.put(
    '/:name',
    {
      preValidation: [server.authenticate, server.guard.role('root', 'option:write')],
      schema: {
        tags: ['options'],
        security: [{ apiKey: [] }],
        summary: 'Update option by name.',
        params: {
          type: 'object',
          properties: {
            name: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          properties: {
            data: { type: 'array', items: { type: 'string' }, minItems: 1 },
          },
          required: ['data'],
        },
      },
    },
    async ({ params, body }, reply) => {
      // @ts-ignore
      const { name } = params;

      const option = await Option.findOne({ name });

      if (!option) reply.notFound(`Option ${name} not found.`);

      // @ts-ignore
      option.data = [...option.data, ...body.data];

      option.data = uniq(option.data);

      await option.save();

      reply.send({ success: true, message: `Option ${name} is updated.`, option });
    },
  );

  done();
}
