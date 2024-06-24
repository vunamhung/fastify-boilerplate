import { join } from 'path';
import Fastify from 'fastify';
import autoload from '@fastify/autoload';
import { env, sendToTelegram } from '~/utils';
import ajvKeywords from 'ajv-keywords';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

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

server.register(import('@fastify/swagger'), {
  openapi: {
    info: { title: 'Fastify', description: 'Fastify api', version: '1.0.0' },
    servers: [{ url: 'http://localhost:8080', description: 'localhost' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    },
  },
  transform: jsonSchemaTransform,
});
server.register(import('@fastify/swagger-ui'));
server.register(import('@scalar/fastify-api-reference'), { routePrefix: '/reference' });
server.register(import('@fastify/under-pressure'), {
  maxEventLoopDelay: 1000,
  message: 'Under pressure!',
  retryAfter: 50,
});
server.register(import('@fastify/cookie'));
server.register(import('@fastify/helmet'));
server.register(import('@fastify/websocket'));
server.register(import('fastify-ip'), {
  order: ['x-my-ip-header'],
  strict: false,
  isAWS: false,
});
server.register(import('@fastify/cors'), {
  origin: env.CORS_ORIGIN.split(','),
  credentials: true,
});
server.register(import('@fastify/sensible')).after(() => {
  server.setErrorHandler(function (error, request, reply) {
    if (reply.statusCode < 500) {
      reply.log.info({ res: reply, err: error }, error?.message);
    } else {
      reply.log.error({ req: request, res: reply, err: error }, error?.message);
      sendToTelegram('-1001568190576', `${request.method}:${request.routerPath} - ${error}`);
    }
    reply.send(error);
  });
});
server.register(import('@fastify/jwt'), {
  secret: env.ACCESS_TOKEN_SECRET,
  cookie: { cookieName: 'token', signed: false },
});
server.register(autoload, { dir: join(__dirname, 'plugins'), ignorePattern: /(helper).(ts|js)/ });
server.register(autoload, { dir: join(__dirname, 'routes'), ignorePattern: /(helper).(ts|js)/ });

server.listen({ port: 8080, host: process.env.HOST }, function (err, address) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  // server.redis.connect().then(() => {
  //   console.log('Redis connected successfully!');
  //   serverHealth.addConnectionCheck('db', () => true);
  // });
  console.log(`Server is now listening on ${address}`);
});
