import { join } from 'path';
import Fastify from 'fastify';
import autoload from '@fastify/autoload';
import { env } from '~/utilities';
import ajvKeywords from 'ajv-keywords';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { connect, connection } from 'mongoose';
import serverHealth from 'server-health';

export const server = Fastify({
  ignoreTrailingSlash: true,
  logger: {
    level: 'error',
    transport: { target: 'pino-pretty' },
  },
  ajv: {
    customOptions: { removeAdditional: 'all' },
    plugins: [ajvKeywords],
  },
});

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

serverHealth.exposeHealthEndpoint(server, '/health', 'fastify');

server.register(import('@fastify/swagger'), {
  openapi: {
    info: { title: 'Fastify', description: 'Fastify api', version: '1.0.0' },
    servers: [{ url: 'http://127.0.0.1:3000', description: 'localhost' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    },
  },
  transform: jsonSchemaTransform,
});
server.register(import('@fastify/swagger-ui'));
server.register(import('@fastify/under-pressure'), {
  maxEventLoopDelay: 1000,
  message: 'Under pressure!',
  retryAfter: 50,
});
server.register(import('@fastify/cookie'));
server.register(import('@fastify/helmet'));
server.register(import('fastify-ip'), {
  order: ['x-my-ip-header'],
  strict: false,
  isAWS: false,
});
server.register(import('@fastify/cors'), {
  origin: env.CORS_ORIGIN.split(','),
  credentials: true,
});
server.register(import('@fastify/sensible'));
server.register(import('@fastify/jwt'), {
  secret: env.ACCESS_TOKEN_SECRET,
  cookie: { cookieName: 'token', signed: false },
});
server.register(autoload, { dir: join(__dirname, 'plugins'), ignorePattern: /(helper).(ts|js)/ });
server.register(autoload, { dir: join(__dirname, 'routes'), ignorePattern: /(helper).(ts|js)/ });

server.listen({ port: env.PORT, host: '127.0.0.1' }, function (err, address) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log(`Server is now listening on ${address}`);

  connection.on('connected', () => console.log('MongoDB connected successfully!'));
  connection.on('disconnected', () => server.log.error({ actor: 'MongoDB' }, 'disconnected'));
  connect(process.env.MONGO_URI).catch((err) => server.log.error({ actor: 'MongoDB' }, err));
});
