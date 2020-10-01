import { FastifyInstance, FastifyRequest } from 'fastify';
import Option from '../../models/Option';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/',
    {
      schema: {
        tags: ['options'],
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            data: { type: 'object' },
          },
          required: ['name', 'data'],
        },
      },
    },
    async (request: FastifyRequest, reply) => {
      try {
        // @ts-ignore
        const option = await Option.create(request.body);

        reply.code(201).send({
          success: true,
          message: 'Option created',
          option,
        });
      } catch (error) {
        reply.send(error);
      }
    },
  );

  done();
}
