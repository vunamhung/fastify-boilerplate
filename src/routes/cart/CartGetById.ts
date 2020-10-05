import { FastifyInstance } from 'fastify';
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
            cartId: { type: 'string', format: 'uuid' },
          },
        },
      },
    },
    async ({ params }, reply) => {
      try {
        // @ts-ignore
        const { cartId } = params;

        let cart = await Cart.findById(cartId).populate({ path: 'products.product' });

        if (!cart) reply.notFound(`Cart with id '${cartId}' not found.`);

        const total = cart.total();

        reply.send({ cart, total });
      } catch (err) {
        if (err.kind === 'ObjectId') reply.badRequest('Wrong OId!');
        reply.send(err);
      }
    },
  );

  done();
}
