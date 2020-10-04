import { FastifyInstance, FastifyRequest } from 'fastify';
import Cart from '../../models/Cart';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/',
    {
      schema: {
        tags: ['cart'],
        summary: 'Add new cart.',
        body: {
          type: 'object',
          properties: {
            products: { type: 'array', items: { type: 'object' } },
          },
          required: ['products'],
        },
      },
    },
    async (request: FastifyRequest, reply) => {
      // @ts-ignore
      const { products } = request.body;

      const cart = await Cart.create({ products }).catch((err) => reply.send(err));

      reply.code(201).send({ success: true, message: 'Cart created.', cart });
    },
  );

  done();
}
