import type { FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

export default fp((fastify, _, done) => {
  fastify.decorateReply('success', function (message) {
    const reply: FastifyReply = this;
    return reply.send({ success: true, message });
  });
  fastify.decorateReply('cache', function (expiresIn = 300) {
    const reply: FastifyReply = this;
    return reply.headers({ 'Cache-Control': `public, max-age=${expiresIn}` });
  });

  done();
});

declare module 'fastify' {
  export interface FastifyReply {
    success(message: string): FastifyReply;
    cache(expiresIn?: number): FastifyReply;
  }
}
