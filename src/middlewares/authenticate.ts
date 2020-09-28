import { FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import fastifyJwt from 'fastify-jwt';
import { boomify } from '@hapi/boom';

export default fp((server, options, done) => {
  server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET_KEY,
    cookie: {
      cookieName: 'token',
    },
  });

  server.decorate('authenticate', async (request: FastifyRequest) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      throw boomify(error);
    }
  });

  done();
});
