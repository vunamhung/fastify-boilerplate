import { FastifyInstance, FastifyRequest } from 'fastify';
import Cart from '../../models/Cart';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/:cartId',
    {
      schema: {
        tags: ['cart'],
        summary: 'Find cart by cart id.',
        params: {
          type: 'object',
          properties: {
            cartId: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply) => {
      try {
        // @ts-ignore
        const { cartId } = request.params;

        let cart = await Cart.findById(cartId).populate({ path: 'products.product' });

        if (!cart) reply.notFound('No cart found.');

        reply.send(cart);
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
