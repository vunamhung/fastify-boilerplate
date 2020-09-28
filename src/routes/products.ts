import { FastifyInstance } from 'fastify';
import Products from '../controllers/Products';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/products',
    {
      preValidation: [server.authenticate],
    },
    async (request, reply) => new Products(server, request, reply).addNewEntry(),
  );

  done();
}
