import { FastifyInstance } from 'fastify';
import Country from '../../models/Country';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/countries',
    {
      schema: {
        tags: ['location'],
        summary: 'Get all countries.',
        response: {
          200: {
            description: 'Success',
            type: 'array',
            items: {
              properties: {
                name: { type: 'string' },
                alpha2Code: { type: 'string' },
                // alpha3Code: { type: 'string' },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const country = await Country.find().catch((err) => reply.send(err));

      reply.send(country);
    },
  );

  done();
}
