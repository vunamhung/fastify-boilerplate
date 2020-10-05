import { FastifyInstance } from 'fastify';
import Cart from '../../models/Cart';

export default function (server: FastifyInstance, options, done) {
  server.delete(
    '/:cartId/product',
    {
      schema: {
        tags: ['cart'],
        summary: 'Delete a product of cart.',
        params: {
          type: 'object',
          properties: {
            cartId: { type: 'string', format: 'uuid' },
          },
        },
        body: {
          type: 'object',
          properties: {
            productId: { type: 'string', format: 'uuid' },
          },
          required: ['productId'],
        },
      },
    },
    async ({ params, body }, reply) => {
      try {
        // @ts-ignore
        const { cartId } = params;
        // @ts-ignore
        const { productId } = body;

        await Cart.findByIdAndUpdate(cartId, { $pull: { products: { product: productId } } });

        reply.send({ success: true, message: 'Product removed.' });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
