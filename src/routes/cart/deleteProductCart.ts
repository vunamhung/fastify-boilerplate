import { FastifyInstance, FastifyRequest } from 'fastify';
import Cart from '../../models/Cart';

export default function (server: FastifyInstance, options, done) {
  server.delete(
    '/:cartId/:productId',
    {
      schema: {
        tags: ['cart'],
        summary: 'Delete a product of cart.',
        params: {
          type: 'object',
          properties: {
            cartId: { type: 'string' },
            productId: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply) => {
      try {
        // @ts-ignore
        const { cartId, productId } = request.params;

        await Cart.findByIdAndUpdate(cartId, { $pull: { products: { product: productId } } });

        reply.send({ success: true, message: 'Product removed.' });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
