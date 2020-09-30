import { join } from 'path';
import { SwaggerOptions } from 'fastify-swagger';
import { FastifyStaticOptions } from 'fastify-static';

export const swaggerOpts: SwaggerOptions = {
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
        type: 'apiKey',
        name: 'apiKey',
        in: 'header',
      },
    },
  },
  exposeRoute: true,
};

export const staticOpts: FastifyStaticOptions = {
  root: join(__dirname, '/public'),
  prefix: '/',
  wildcard: false,
};
