import { FastifyInstance } from 'fastify';
import Cart from '../../models/Cart';
import { iBody, iParams, isObjectId } from '../../utilities';

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
    async ({ params, body }, reply) => {
      try {
        const { cartId } = params as iParams;
        const { quantity, productId } = body as iBody;

        if (!isObjectId(cartId)) return reply.badRequest('Wrong cart ID!');

        if (!isObjectId(productId)) return reply.badRequest('Wrong product ID!');

        await Cart.findOneAndUpdate({ _id: cartId, 'products.product': productId }, { $inc: { 'products.$.quantity': quantity } });
        reply.send({ success: true, message: 'Product quantity updated.' });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
