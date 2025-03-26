import { join } from 'path';
import Fastify from 'fastify';
import autoload from '@fastify/autoload';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

export const server = Fastify({
  ignoreTrailingSlash: true,
  ajv: {
    customOptions: {
      removeAdditional: 'all',
    },
  },
});

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(import('@fastify/swagger'), {
  openapi: {
    info: { title: 'Fastify Boilerplate', description: 'Fastify Boilerplate API documentation', version: '2.0.0' },
    servers: [
      { url: 'http://localhost:8080', description: 'localhost' },
      { url: 'https://thin-crm-be-z4u7fgqu3a-as.a.run.app', description: 'live' },
    ],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    },
  },
  transform: jsonSchemaTransform,
});
server.register(import('@fastify/swagger-ui'));

server.register(autoload, { dir: join(__dirname, 'modules'), ignorePattern: /(helper).(ts|js)/ });
server.register(autoload, { dir: join(__dirname, 'plugins'), ignorePattern: /(helper).(ts|js)/ });

server.ready((err) => {
  if (err) throw err;
});

server.listen({ port: 8080, host: process.env.HOST }, function (err, address) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening on ${address}`);
});
