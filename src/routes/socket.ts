import type { FastifyReply } from 'fastify';
import type { ZFastify } from '~/@types';

export default function (fastify: ZFastify, _, done) {
  fastify.route({
    method: 'GET',
    url: '/socket',
    schema: {
      tags: ['socket'],
    },
    websocket: true,
    handler: (_, reply: FastifyReply) => {},
    wsHandler: (connection, request) => {
      connection.socket.on('message', (message) => {
        connection.socket.send('Hello Fastify WebSockets');
      });
    },
  });

  done();
}
