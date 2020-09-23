import fp from 'fastify-plugin';

export default fp(async (server, opts, done) => {
  server.route({
    url: '/status',
    logLevel: 'warn',
    method: ['GET', 'HEAD'],
    handler: async (request, reply) => {
      return reply.send({ date: new Date(), works: true });
    },
  });

  done();
});
