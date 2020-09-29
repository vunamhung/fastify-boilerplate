import { FastifyInstance } from 'fastify';
import Users from '../controllers/Users';

export default function (server: FastifyInstance, options, done) {
  server.post('/register', {}, async (request, reply) => new Users(server, request, reply).addNewEntry());

  done();
}
