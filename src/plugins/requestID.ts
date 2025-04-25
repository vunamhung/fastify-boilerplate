import type { ZFastify } from '~/@types';
import fp from 'fastify-plugin';

export default fp((fastify: ZFastify, _, done) => {
  fastify.decorateRequest('reqID', '');
  fastify.addHook('onRequest', (request, _reply, next) => {
    request.reqID = fastify.nano.id(15);
    next();
  });

  fastify.addHook('onSend', (request, reply, _payload, next) => {
    reply.header('x-request-id', request.reqID);
    next();
  });
  done();
});

declare module 'fastify' {
  interface FastifyRequest {
    reqID: string;
  }
}
