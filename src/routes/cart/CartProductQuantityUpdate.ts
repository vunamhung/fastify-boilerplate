import { FastifyInstance } from 'fastify';
import Cart from '../../models/Cart';

export default function (server: FastifyInstance, options, done) {
  server.put(
    '/:cartId/product/quantity',
    {
      schema: {
        tags: ['cart'],
        summary: 'Increase quantify of product in cart.',
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
            quantity: { type: 'number' },
          },
          required: ['productId', 'quantity'],
        },
      },
    },
    async ({ params, body }, reply) => {
      try {
        // @ts-ignore
        const { cartId } = params;
        // @ts-ignore
        const { quantity, productId } = body;

        await Cart.findOneAndUpdate({ _id: cartId, 'products.product': productId }, { $inc: { 'products.$.quantity': quantity } });
        reply.send({ success: true, message: 'Product quantity updated.' });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
