import { FastifyInstance } from 'fastify';
import Cart from '../../models/Cart';

export default function (server: FastifyInstance, options, done) {
  server.put(
    '/:cartId/product',
    {
      schema: {
        tags: ['cart'],
        summary: 'Add/update a product of cart.',
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

        const cart = await Cart.findById(cartId);

        const productExists = cart.products.some((item) => productId == item.product);

        if (productExists) {
          await Cart.findOneAndUpdate({ _id: cartId, 'products.product': productId }, { $inc: { 'products.$.quantity': quantity } });
          reply.send({ success: true, message: 'Product quantity updated.' });
        } else {
          // @ts-ignore
          await Cart.findOneAndUpdate({ _id: cartId }, { $addToSet: { products: { product: productId, quantity } } });
          reply.send({ success: true, message: 'Product added.' });
        }
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
