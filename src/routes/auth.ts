import { FastifyInstance } from 'fastify';
import Auth from '../controllers/Auth';

export default function (server: FastifyInstance, options, done) {
  server.post('/login', {}, async (request, reply) => new Auth(server, request, reply).login());
  server.post('/logout', { preValidation: [server.authenticate] }, async (request, reply) => new Auth(server, request, reply).logout());
  server.post('/forgot-password', {}, async (request, reply) => new Auth(server, request, reply).forgotPassword());
  server.post('/reset/:token', {}, async (request, reply) => new Auth(server, request, reply).resetPasswordByToken());

  done();
}
