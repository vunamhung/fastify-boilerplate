import { FastifyInstance, FastifyRequest } from 'fastify';
import Cart from '../../models/Cart';

export default function (server: FastifyInstance, options, done) {
  server.put(
    '/:cartId/update/',
    {
      schema: {
        tags: ['cart'],
        summary: 'Add/update a product of cart.',
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
