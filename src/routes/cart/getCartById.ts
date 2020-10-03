import { FastifyInstance, FastifyRequest } from 'fastify';
import Cart from '../../models/Cart';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/:cardId',
    {
      schema: {
        tags: ['cart'],
        summary: 'Find cart by card id.',
        params: {
          type: 'object',
          properties: {
            cardId: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply) => {
      try {
        // @ts-ignore
        const { cardId } = request.params;

        let cart = await Cart.findById(cardId).populate({ path: 'products.product' });

        if (!cart) reply.notFound('No cart found.');

        reply.code(201).send({ cart });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
