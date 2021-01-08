import { FastifyInstance } from 'fastify';
import Country from '../../models/Country';
import { iParams } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/country/:code',
    {
      schema: {
        tags: ['location'],
        summary: 'Get country by code.',
        params: {
          type: 'object',
          properties: {
            code: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'Success',
            type: 'object',
            properties: {
              name: { type: 'string' },
              alpha2Code: { type: 'string' },
              // alpha3Code: { type: 'string' },
            },
          },
        },
      },
    },
    async ({ params }, reply) => {
      const { code } = params as iParams;

      const country = await Country.findOne({ alpha2Code: code }).catch((err) => reply.send(err));

      if (!country) reply.notFound(`Country with code '${code}' not found.`);

      reply.send(country);
    },
  );

  done();
}
