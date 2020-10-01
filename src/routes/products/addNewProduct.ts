import { FastifyInstance, FastifyRequest } from 'fastify';
import Product from '../../models/Product';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            sku: { type: 'string' },
            name: { type: 'string' },
          },
          required: ['sku', 'name'],
        },
      },
    },
    async (request: FastifyRequest, reply) => {
      try {
        // @ts-ignore
        const checkSku = await Product.findOne({ sku: request.body.sku });

        if (checkSku) reply.badRequest('This sku is already in use.');

        // @ts-ignore
        const product = await Product.create(request.body);

        reply.code(201).send({ success: true, message: 'Product created', product });
      } catch (error) {
        reply.send(error);
      }
    },
  );

  done();
}