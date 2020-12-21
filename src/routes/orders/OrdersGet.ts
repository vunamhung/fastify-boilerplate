import { FastifyInstance } from 'fastify';
import Order from '../../models/Order';
import { iQuery } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/',
    {
      preValidation: [server.authenticate, server.guard.role('root', 'admin', 'orders:read')],
      schema: {
        tags: ['orders'],
        security: [{ apiKey: [] }],
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
      const { limit = 20, skip = 0 } = query as iQuery;

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
