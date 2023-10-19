import type { FastifyInstance, FastifyReply } from 'fastify';

export default function (fastify: FastifyInstance, _, done) {
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
