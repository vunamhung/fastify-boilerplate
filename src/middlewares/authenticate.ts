import { FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import fastifyJwt from 'fastify-jwt';
import Option from '../models/Option';

export default fp((server, options, done) => {
  const validateToken = async (request, decodedToken) => {
    const banUsers = await Option.findOne({ name: 'ban_users' });

    return !banUsers?.data?.includes(decodedToken.user.id);
  };

  server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET_KEY,
    trusted: validateToken,
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
