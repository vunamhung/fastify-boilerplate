import fp from 'fastify-plugin';
import Vehicles from '../controllers/Vehicles';

export default fp(async (server, opts, done) => {
  server.get('/vehicles/:id', {}, async (request, reply) => new Vehicles(server, request, reply).findOneEntry());
  server.get('/vehicles', {}, async (request, reply) => new Vehicles(server, request, reply).findAllEntries());
  server.post('/vehicles', {}, async (request, reply) => new Vehicles(server, request, reply).addNewEntry());

  done();
});
