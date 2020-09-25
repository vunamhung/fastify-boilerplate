import { FastifyInstance } from 'fastify';
import Products from '../controllers/Products';

export default function (server: FastifyInstance, options, done) {
  server.get('/products', {}, async (request, reply) => new Products(server, request, reply).findAllEntries());

  done();
}
