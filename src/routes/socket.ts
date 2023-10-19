import type { FastifyInstance, FastifyReply } from 'fastify';
import { z } from 'zod';

export default function (fastify: FastifyInstance, _, done) {
  fastify.route({
    method: 'GET',
    url: '/stream',
    schema: {
      tags: ['stream'],
      summary: 'Get an user info',
    },
    handler: (_, reply: FastifyReply) => {
      reply.header('Content-Type', 'application/octet-stream');
      reply.send(new Uint16Array(10));
    },
  });

  done();
}
