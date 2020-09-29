import { readFileSync } from 'fs';
import { join } from 'path';
import { FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import fastifyJwt from 'fastify-jwt';
import { unauthorized } from '@hapi/boom';

export default fp((server, options, done) => {
  const certsDir = join(__dirname, '../..', 'certs');

  server.register(fastifyJwt, {
    secret: {
      private: readFileSync(`${certsDir}/private.pem`, 'utf8'),
      public: readFileSync(`${certsDir}/public.pem`, 'utf8'),
    },
    sign: {
      algorithm: 'RS256',
      expiresIn: '7d',
    },
    cookie: {
      cookieName: 'token',
    },
  });

  server.decorate('authenticate', async (request: FastifyRequest) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      request.log.error(error);
      throw unauthorized(error);
    }
  });

  done();
});
