import { FastifyInstance } from 'fastify';
import Cart from '../../models/Cart';
import Order from '../../models/Order';
import { iParams, isObjectId } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/:cartId',
    {
      schema: {
        tags: ['orders'],
        summary: 'Add new order.',
        params: {
          type: 'object',
          properties: {
            cartId: { type: 'string' },
          },
        },
      },
    },
    async ({ params }, reply) => {
      const { cartId } = params as iParams;

      if (!isObjectId(cartId)) return reply.badRequest('Wrong cart ID!');

      const cart = await Cart.findById(cartId).populate({ path: 'products.product' });

      const order = await Order.create({ cart }).catch((err) => reply.send(err));

      reply.code(201).send(order);
    },
  );

  done();
}
