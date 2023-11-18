import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { isNilOrEmpty } from 'ramda-adjunct';

export default fp((fastify: FastifyInstance, _, done) => {
  fastify.addHook('preSerialization', async (request, reply, payload) => {
    if (isNilOrEmpty(payload)) {
      reply.code(204);
      return;
    }

    return payload;
  });

  fastify.addHook('onSend', async (request, reply, payload) => {
    if ((isNilOrEmpty(payload) && reply.statusCode === 200) || reply.statusCode === 204) {
      reply.code(204);
      return;
    }

    return payload;
  });

  done();
});
