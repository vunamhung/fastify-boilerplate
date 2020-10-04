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
      const products = await Product.find().catch((err) => reply.send(err));

      if (!products) reply.notFound('No products found.');

      reply.send(products);
    },
  );

  done();
}
