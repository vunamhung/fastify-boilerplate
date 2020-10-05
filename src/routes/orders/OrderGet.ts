import { FastifyInstance } from 'fastify';
import Order from '../../models/Order';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/:orderId',
    {
      preValidation: [server.authenticate, server.isAdmin],
      schema: {
        tags: ['orders'],
        summary: 'Get one order by id.',
        params: {
          type: 'object',
          properties: {
            orderId: { type: 'string' },
          },
        },
      },
    },
    async ({ params }, reply) => {
      // @ts-ignore
      const { orderId } = params;

      const order = await Order.findById(orderId).catch((err) => reply.send(err));

      if (!order) reply.notFound(`Order with id '${orderId}' not found.`);

      reply.send(order);
    },
  );

  done();
}