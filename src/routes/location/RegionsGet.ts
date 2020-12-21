import { FastifyInstance } from 'fastify';
import Region from '../../models/Region';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/regions',
    {
      schema: {
        tags: ['location'],
        summary: 'Get all regions.',
      },
    },
    async (request, reply) => {
      const country = await Region.find().catch((err) => reply.send(err));

      reply.send(country);
    },
  );

  done();
}
