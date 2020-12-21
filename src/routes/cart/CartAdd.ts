import { FastifyInstance } from 'fastify';
import Cart from '../../models/Cart';
import { iBody } from '../../utilities';

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
            products: { type: 'array', items: { type: 'object', properties: { product: { type: 'string' }, quantity: { type: 'number' } } } },
          },
          required: ['products'],
        },
        response: {
          201: {
            description: 'Cart created.',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              cart: {
                type: 'object',
                properties: { _id: { type: 'string' }, products: { type: 'array', properties: { items: { type: 'object' } } } },
              },
            },
          },
        },
      },
    },
    async ({ body }, reply) => {
      const { products } = body as iBody;

      // @ts-ignore
      const cart = await Cart.create({ products }).catch((err) => reply.send(err));

      reply.code(201).send({ success: true, message: 'Cart created.', cart });
    },
  );

  done();
}
