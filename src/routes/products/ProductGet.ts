import { FastifyInstance } from 'fastify';
import Product from '../../models/Product';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/:productId',
    {
      schema: {
        tags: ['products'],
        summary: 'Get one product by id.',
        params: {
          type: 'object',
          properties: {
            productId: { type: 'string' },
          },
        },
      },
    },
    async ({ params }, reply) => {
      // @ts-ignore
      const { productId } = params;

      const product = await Product.findById(productId).catch((err) => {
        if (err.kind === 'ObjectId') return reply.badRequest('Wrong OId!');
        return reply.send(err);
      });

      if (!product) reply.notFound(`Product with id '${productId}' not found.`);

      reply.send(product);
    },
  );

  done();
}
