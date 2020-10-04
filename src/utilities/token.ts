import { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export interface iToken {
  user: {
    id: string;
    email: string;
    role: string;
    banned?: boolean;
    verified?: boolean;
  };
}

export default fp((server: FastifyInstance, options, done) => {
  server.decorate('token', (request: FastifyRequest) => {
    const { authorization } = request.headers;
    const token: iToken = server.jwt.decode(authorization?.split(' ')[1]);

    return token;
  });

  done();
});
