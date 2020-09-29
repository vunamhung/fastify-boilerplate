import { FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import fastifyJwt from 'fastify-jwt';

export default fp((server, options, done) => {
  server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET_KEY,
    sign: {
      expiresIn: '7d',
    },
    cookie: {
      cookieName: 'token',
    },
  });

  server.decorate('authenticate', async (request: FastifyRequest, reply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.send(error);
    }
  });

  done();
});
