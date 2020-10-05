import { FastifyInstance } from 'fastify';
import Order from '../../models/Order';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/',
    {
      preValidation: [server.isAdmin],
      schema: {
        tags: ['orders'],
        summary: 'Find all orders.',
      },
    },
    async (request, reply) => {
      const orders = await Order.find().catch((err) => reply.send(err));

      if (!orders) reply.notFound('No orders found.');

      reply.send(orders);
    },
  );

  done();
}
