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
    let token: iToken;

    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
      token = server.jwt.decode(request.headers.authorization?.split(' ')[1]);
    } else {
      token = server.jwt.decode(request.cookies.token);
    }

    return token;
  });

  done();
});
