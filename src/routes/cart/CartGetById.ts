import { FastifyInstance } from 'fastify';
import Cart from '../../models/Cart';
import { iParams, isObjectId } from '../../utilities';

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
    async ({ params }, reply) => {
      try {
        const { cartId } = params as iParams;

        if (!isObjectId(cartId)) return reply.badRequest('Wrong cart ID!');

        let cart = await Cart.findById(cartId).populate({ path: 'products.product' });

        if (!cart) reply.notFound(`Cart with id '${cartId}' not found.`);

        const total = cart.total();

        reply.send({ cart, total });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
