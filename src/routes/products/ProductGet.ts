import { FastifyInstance, FastifyRequest } from 'fastify';
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
    async (request: FastifyRequest, reply) => {
      // @ts-ignore
      const { productId } = request.params;

      const product = await Product.findById(productId).catch((err) => reply.send(err));

      if (!product) reply.notFound(`Product with id '${productId}' not found.`);

      reply.send(product);
    },
  );

  done();
}
