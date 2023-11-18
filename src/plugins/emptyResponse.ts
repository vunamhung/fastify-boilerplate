import type { FastifyInstance } from 'fastify';
import { convertType } from '~/utilities';
import fp from 'fastify-plugin';
import { isNilOrEmpty } from 'ramda-adjunct';

export default fp((fastify: FastifyInstance, _, done) => {
  fastify.addHook('onSend', async (_, reply, payload: any) => {
    if ((isNilOrEmpty(convertType(payload)) && reply.statusCode === 200) || reply.statusCode === 204) {
      reply.code(204);
      return;
    }

    return payload;
  });

  done();
});
