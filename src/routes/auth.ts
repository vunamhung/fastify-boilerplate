import { FastifyInstance } from 'fastify';
import Auth from '../controllers/Auth';

export default function (server: FastifyInstance, options, done) {
  server.post('/login', {}, async (request, reply) => new Auth(server, request, reply).loginUser());
  server.post('/forgot', {}, async (request, reply) => new Auth(server, request, reply).forgotPassword());
  server.post('/reset/:token', {}, async (request, reply) => new Auth(server, request, reply).resetPasswordByToken());

  done();
}
