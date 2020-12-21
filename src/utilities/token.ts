import { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export interface iToken {
  user: {
    id: string;
    email: string;
    role: string;
    auth: string;
    verified?: boolean;
  };
  jti: string;
}

export default fp((server: FastifyInstance, options, done) => {
  server.decorate('decodedToken', ({ headers, cookies }: FastifyRequest) => {
    const token: iToken = cookies?.token ? server.jwt.verify(cookies.token) : server.jwt.verify(headers?.authorization?.split(' ')[1]);

    return token;
  });

  done();
});
