import { FastifyInstance } from 'fastify';
import Country from '../../models/Country';

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
      },
    },
    async ({ params }, reply) => {
      // @ts-ignore
      const { code } = params;

      const country = await Country.findOne({ alpha2Code: code }).catch((err) => reply.send(err));

      if (!country) reply.notFound(`Country with code '${code}' not found.`);

      reply.send(country);
    },
  );

  done();
}
