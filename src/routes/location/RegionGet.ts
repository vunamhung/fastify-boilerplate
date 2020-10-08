import { FastifyInstance } from 'fastify';
import Region from '../../models/Region';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/region/:code',
    {
      schema: {
        tags: ['location'],
        summary: 'Get region by code.',
        params: {
          type: 'object',
          properties: {
            code: { type: 'string' },
          },
        },
      },
    },
    async ({ params }, reply) => {
      // @ts-ignore
      const { code } = params;

      const country = await Region.findOne({ countryShortCode: code }).catch((err) => reply.send(err));

      if (!country) reply.notFound(`Country with code '${code}' not found.`);

      reply.send(country);
    },
  );

  done();
}
