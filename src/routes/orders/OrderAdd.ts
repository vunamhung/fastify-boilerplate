import { FastifyInstance } from 'fastify';
import Cart, { iCartModel } from '../../models/Cart';
import Order from '../../models/Order';
import { isObjectId } from '../../utilities';

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
      // @ts-ignore
      const { cartId } = params;

      if (!isObjectId(cartId)) return reply.badRequest('Wrong cart ID!');

      const cart = await Cart.findById(cartId).populate({ path: 'products.product' });

      const total = cart.total();

      const order = await Order.create({ cart, total }).catch((err) => reply.send(err));

      reply.code(201).send(order);
    },
  );

  done();
}
