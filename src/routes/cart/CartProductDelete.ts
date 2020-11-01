import { FastifyInstance } from 'fastify';
import Cart from '../../models/Cart';
import { isObjectId } from '../../utilities';

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
        response: {
          200: {
            description: 'Product removed.',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async ({ params, body }, reply) => {
      try {
        // @ts-ignore
        const { cartId } = params;
        // @ts-ignore
        const { productId } = body;

        if (!isObjectId(cartId)) return reply.badRequest('Wrong cart ID!');

        if (!isObjectId(productId)) return reply.badRequest('Wrong product ID!');

        await Cart.findByIdAndUpdate(cartId, { $pull: { products: { product: productId } } });

        reply.send({ success: true, message: 'Product removed.' });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
