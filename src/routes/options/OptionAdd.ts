import { FastifyInstance } from 'fastify';
import Option from '../../models/Option';
import { DUPLICATE_KEY_ERROR } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/',
    {
      preValidation: [server.authenticate, server.isRoot],
      schema: {
        tags: ['options'],
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
    async ({ body }, reply) => {
      // @ts-ignore
      const option = await Option.create(body).catch((err) => {
        if (err.code === DUPLICATE_KEY_ERROR) reply.conflict('Duplicate key');
        reply.send(err);
      });

      reply.code(201).send({ success: true, message: 'Option created.', option });
    },
  );

  done();
}
