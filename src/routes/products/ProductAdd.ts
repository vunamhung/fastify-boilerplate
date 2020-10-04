import { FastifyInstance } from 'fastify';
import Product from '../../models/Product';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/',
    {
      preValidation: [server.authenticate, server.isAdmin],
      schema: {
        tags: ['products'],
        security: [{ apiKey: [] }],
        summary: 'Add new product.',
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            sku: { type: 'string' },
            price: { type: 'number' },
            description: { type: 'string' },
            taxable: { type: 'boolean' },
            brand: { type: 'string' },
          },
          required: ['name', 'sku', 'price'],
        },
      },
    },
    async ({ body }, reply) => {
      try {
        // @ts-ignore
        const { sku } = body;

        const checkSku = await Product.findOne({ sku });

        if (checkSku) reply.badRequest('This sku is already in use.');

        // @ts-ignore
        const product = await Product.create(body);

        reply.code(201).send({ success: true, message: 'Product created.', product });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
