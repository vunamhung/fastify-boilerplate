import type { ZFastify } from '~/@types';
import { convertType } from '~/utilities';
import fp from 'fastify-plugin';
import { isBlank } from 'ramda-adjunct';

export default fp((fastify: ZFastify, _, done) => {
  fastify.addHook('onSend', async (_, reply, payload: any) => {
    if ((isBlank(convertType(payload)) && reply.statusCode === 200) || reply.statusCode === 204) {
      reply.code(204);
      return;
    }

    return payload;
  });

  done();
});
