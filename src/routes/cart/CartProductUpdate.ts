import { FastifyInstance } from 'fastify';
import Cart from '../../models/Cart';
import { iBody, iParams, isObjectId } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.put(
    '/:id/product',
    {
      schema: {
        tags: ['cart'],
        summary: 'Add/update a product of cart.',
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
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
        const { id } = params as iParams;
        const { quantity, productId } = body as iBody;

        if (!isObjectId(id)) return reply.badRequest('Wrong cart ID!');

        if (!isObjectId(productId)) return reply.badRequest('Wrong product ID!');

        const cart = await Cart.findById(id);

        const productExists = cart.products.some((item) => productId == item.product);

        if (productExists) {
          await Cart.findOneAndUpdate({ id, 'products.product': productId }, { $inc: { 'products.$.quantity': quantity } });
          reply.send({ success: true, message: 'Product quantity updated.' });
        } else {
          // @ts-ignore
          await Cart.findOneAndUpdate({ id }, { $addToSet: { products: { product: productId, quantity } } });
          reply.send({ success: true, message: 'Product added.' });
        }
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
