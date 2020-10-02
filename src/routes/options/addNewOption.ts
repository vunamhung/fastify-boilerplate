import { FastifyInstance, FastifyRequest } from 'fastify';
import Option from '../../models/Option';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/',
    {
      preValidation: [server.authenticate],
      schema: {
        tags: ['options'],
        security: [{ apiKey: [] }],
        summary: 'Add new option.',
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            data: { type: 'array', items: { type: 'string' }, minItems: 1 },
          },
          required: ['name', 'data'],
        },
      },
    },
    async (request: FastifyRequest, reply) => {
      // @ts-ignore
      const option = await Option.create(request.body).catch((err) => reply.send(err));

      reply.code(201).send({ success: true, message: 'Option created.', option });
    },
  );

  done();
}
