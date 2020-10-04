import { FastifyInstance, FastifyRequest } from 'fastify';
import Cart from '../../models/Cart';

export default function (server: FastifyInstance, options, done) {
  server.put(
    '/:cartId/quantity',
    {
      schema: {
        tags: ['cart'],
        summary: 'Increase quantify of product in cart.',
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
            quantity: { type: 'number' },
          },
          required: ['productId', 'quantity'],
        },
      },
    },
    async (request: FastifyRequest, reply) => {
      try {
        // @ts-ignore
        const { cartId } = request.params;
        // @ts-ignore
        const { quantity, productId } = request.body;

        await Cart.findOneAndUpdate({ _id: cartId, 'products.product': productId }, { $inc: { 'products.$.quantity': quantity } });
        reply.send({ success: true, message: 'Product quantity updated.' });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
