import { FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import fastifyJwt from 'fastify-jwt';
import { boomify } from '@hapi/boom';

export default fp(async (server, options, done) => {
  server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET_KEY,
  });

  server.decorate('authenticate', async function (request: FastifyRequest) {
    try {
      await request.jwtVerify();
    } catch (error) {
      throw boomify(error);
    }
  });

  done();
});
