import { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export interface iToken {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export default fp((server: FastifyInstance, options, done) => {
  server.decorate('token', (request: FastifyRequest) => {
    const auth = request.headers.authorization;
    const token: iToken = auth?.startsWith('Bearer') ? server.jwt.decode(auth?.split(' ')[1]) : server.jwt.decode(request.cookies.token);

    return token;
  });

  done();
});
