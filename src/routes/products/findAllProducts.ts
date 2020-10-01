import { FastifyInstance, FastifyRequest } from 'fastify';
import Product from '../../models/Product';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/',
    {
      schema: {
        tags: ['products'],
        summary: 'Find all products.',
      },
    },
    async (request: FastifyRequest, reply) => {
      try {
        const products = await Product.find();

        if (!products) reply.badRequest('No products found.');

        reply.send({ products });
      } catch (error) {
        reply.send(error);
      }
    },
  );

  done();
}
