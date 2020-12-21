import { FastifyInstance } from 'fastify';
import Product from '../../models/Product';
import { iQuery } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/',
    {
      schema: {
        tags: ['products'],
        summary: 'Find all products.',
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

      const products = await Product.find()
        .limit(limit)
        .skip(skip)
        .catch((err) => reply.send(err));

      if (!products) reply.notFound('No products found.');

      reply.send(products);
    },
  );

  done();
}
