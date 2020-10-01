import fp from 'fastify-plugin';

export default fp((server, options, done) => {
  server.register(import('fastify-swagger'), {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: 'VNH API Documentation',
        description: 'testing the fastify swagger api',
        version: '0.9.0',
      },
      host: 'api.hungvu.work',
      schemes: ['https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        apiKey: {
          description: 'Standard Authorization header using the Bearer scheme. Example: "Bearer {token}"',
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
    },
    exposeRoute: true,
  });

  done();
});
