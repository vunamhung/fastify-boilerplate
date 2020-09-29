import { FastifyInstance } from 'fastify';
import Vehicles from '../controllers/Vehicles';

export default function (server: FastifyInstance, options, done) {
  server.get(
    '/vehicles/:id',
    {
      schema: {
        description: 'Get one vehicle',
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
  server.delete(
    '/vehicles/:id',
    {
      schema: {
        description: 'Delete one vehicle',
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'vehicle id',
            },
          },
        },
      },
    },
    async (request, reply) => new Vehicles(server, request, reply).findOneAndDelete(),
  );
  server.put(
    '/vehicles/:id',
    {
      preValidation: [server.authenticate],
      schema: {
        description: 'Edit one vehicle',
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'vehicle id',
            },
          },
        },
      },
    },
    async (request, reply) => new Vehicles(server, request, reply).findOneAndUpdate(),
  );
  server.get('/vehicles', {}, async (request, reply) => new Vehicles(server, request, reply).findAllEntries());
  server.post(
    '/vehicles',
    {
      preValidation: [server.authenticate],
    },
    async (request, reply) => new Vehicles(server, request, reply).addNewEntry(),
  );

  done();
}
