import { join } from 'path';
import Fastify from 'fastify';
import autoload from '@fastify/autoload';
import { env } from '~/utilities';
import ajvKeywords from 'ajv-keywords';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

export const app = Fastify({
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

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(import('@fastify/swagger'), {
  openapi: {
    info: { title: 'Fastify', description: 'Fastify api', version: '1.0.0' },
    servers: [{ url: 'http://127.0.0.1:3000', description: 'localhost' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    },
  },
  transform: jsonSchemaTransform,
});
app.register(import('@fastify/swagger-ui'));
app.register(import('@fastify/under-pressure'), {
  maxEventLoopDelay: 1000,
  message: 'Under pressure!',
  retryAfter: 50,
});
app.register(import('@fastify/cookie'));
app.register(import('@fastify/helmet'));
app.register(import('@fastify/cors'), {
  origin: env.CORS_ORIGIN.split(','),
  credentials: true,
});
app.register(import('@fastify/sensible'));
app.register(import('@fastify/jwt'), {
  secret: env.ACCESS_TOKEN_SECRET,
  cookie: { cookieName: 'token', signed: false },
});
app.register(autoload, { dir: join(__dirname, 'plugins'), ignorePattern: /(helper).(ts|js)/ });
app.register(autoload, { dir: join(__dirname, 'routes'), ignorePattern: /(helper).(ts|js)/ });

app.listen({ port: env.PORT, host: '127.0.0.1' }, function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.redis.connect().then(() => console.log('Redis connected successfully!'));
  console.log(`Server is now listening on ${address}`);
});
