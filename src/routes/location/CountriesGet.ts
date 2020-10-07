import { FastifyInstance } from 'fastify';
import Country from '../../models/Country';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/countries',
    {
      schema: {
        tags: ['location'],
        summary: 'Get all countries.',
      },
    },
    async (request, reply) => {
      // @ts-ignore

      const country = await Country.find().catch((err) => reply.send(err));

      reply.send(country);
    },
  );

  done();
}
