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
  server.decorate('token', ({ headers }: FastifyRequest) => {
    const token: iToken = server.jwt.decode(headers?.authorization?.split(' ')[1]);

    return token;
  });

  done();
});
