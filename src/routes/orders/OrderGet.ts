import { FastifyInstance } from 'fastify';
import Order from '../../models/Order';
import { isObjectId } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/:orderId',
    {
      preValidation: server.guard.role('root', 'admin'),
      schema: {
        tags: ['orders'],
        security: [{ apiKey: [] }],
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

      if (!isObjectId(orderId)) return reply.badRequest('Wrong order ID!');

      const order = await Order.findById(orderId).catch((err) => reply.send(err));

      if (!order) reply.notFound(`Order with id '${orderId}' not found.`);

      reply.send(order);
    },
  );

  done();
}
