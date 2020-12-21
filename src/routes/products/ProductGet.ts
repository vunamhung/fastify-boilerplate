import { FastifyInstance } from 'fastify';
import Product from '../../models/Product';
import { iParams, isObjectId } from '../../utilities';

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
      const { productId } = params as iParams;

      if (!isObjectId(productId)) return reply.badRequest('Wrong product ID!');

      const product = await Product.findById(productId).catch((err) => reply.send(err));

      if (!product) reply.notFound(`Product with id '${productId}' not found.`);

      reply.send(product);
    },
  );

  done();
}
