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
        querystring: {
          type: 'object',
          properties: {
            limit: { type: 'number' },
            skip: { type: 'number' },
          },
        },
      },
    },
    async ({ query }, reply) => {
      // @ts-ignore
      const { limit = 20, skip = 0 } = query;

      const orders = await Order.find()
        .limit(limit)
        .skip(skip)
        .catch((err) => reply.send(err));

      if (!orders) reply.notFound('No orders found.');

      reply.send(orders);
    },
  );

  done();
}
