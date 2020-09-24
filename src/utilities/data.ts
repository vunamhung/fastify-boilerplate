import { join } from 'path';
import { SwaggerOptions } from 'fastify-swagger';
import { FastifyStaticOptions } from 'fastify-static';
import { RateLimitPluginOptions } from 'fastify-rate-limit';

export const rateLimitOpts: RateLimitPluginOptions = {
  max: 100,
  timeWindow: 6000,
  cache: 10000,
};

export const swaggerOpts: SwaggerOptions = {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'VNH API Documentation',
      description: 'testing the fastify swagger api',
      version: '0.1.0',
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here',
    },
    host: 'api.hungvu.work',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'user', description: 'User related end-points' },
      { name: 'code', description: 'Code related end-points' },
    ],
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
  root: join(__dirname, '..', '..', 'public'),
  prefix: '/',
  wildcard: false,
};
