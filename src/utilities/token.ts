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
  server.decorate('decodedToken', ({ headers: { authorization }, cookies: { token } }: FastifyRequest) => {
    const rawToken = token ? token : authorization?.split(' ')[1];
    const decoded: iToken = server.jwt.verify(rawToken);

    return decoded;
  });

  done();
});
