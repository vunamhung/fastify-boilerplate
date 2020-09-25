import { FastifyInstance } from 'fastify';
import Vehicles from '../controllers/Vehicles';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/vehicles/:id',
    {
      schema: {
        description: 'Get one vehicle',
        tags: ['code'],
        summary: 'vehicle',
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'vehicle id',
            },
          },
        },
        response: {
          201: {
            description: 'Successful response',
            type: 'object',
            properties: {
              _id: { type: 'string' },
              year: { type: 'number' },
              name: { type: 'string' },
              createdDate: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => new Vehicles(server, request, reply).findOneEntry(),
  );
  server.delete('/vehicles/:id', {}, async (request, reply) => new Vehicles(server, request, reply).findOneAndDelete());
  server.get('/vehicles', {}, async (request, reply) => new Vehicles(server, request, reply).findAllEntries());
  server.post('/vehicles', {}, async (request, reply) => new Vehicles(server, request, reply).addNewEntry());

  done();
}
