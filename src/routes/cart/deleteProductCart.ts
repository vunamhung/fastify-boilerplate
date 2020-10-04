import { FastifyInstance, FastifyRequest } from 'fastify';
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
            cartId: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          properties: {
            productId: { type: 'string' },
          },
          required: ['productId'],
        },
      },
    },
    async (request: FastifyRequest, reply) => {
      try {
        // @ts-ignore
        const { cartId } = request.params;
        // @ts-ignore
        const { productId } = request.body;

        await Cart.findByIdAndUpdate(cartId, { $pull: { products: { product: productId } } });

        reply.send({ success: true, message: 'Product removed.' });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
