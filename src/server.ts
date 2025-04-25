import { join } from 'path';
import Fastify from 'fastify';
import autoload from '@fastify/autoload';
import { env } from '~/utils';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

export const server = Fastify({
  trustProxy: true,
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
      { url: `http://127.0.0.1:${env.PORT}`, description: 'localhost' },
      { url: 'https://thin-crm-be-z4u7fgqu3a-as.a.run.app', description: 'live' },
    ],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    },
  },
  transform: jsonSchemaTransform,
});
server.register(import('@fastify/swagger-ui'));

server.register(import('@fastify/sensible')).after(() => {
  server.setErrorHandler(function (error, request, reply) {
    if (reply.statusCode < 500) {
      reply.log.info({ res: reply, err: error }, error?.message);
    } else {
      reply.log.error({ req: request, res: reply, err: error }, error?.message);
      // sendToTelegram('-1001568190576', `${request.method}:${request.routerPath} - ${error}`);
    }
    reply.send(error);
  });
});

server.register(import('@fastify/jwt'), {
  secret: env.ACCESS_TOKEN_SECRET,
  cookie: { cookieName: 'token', signed: false },
});

server.register(autoload, { dir: join(__dirname, 'modules'), ignorePattern: /(helper).(ts|js)/ });
server.register(autoload, { dir: join(__dirname, 'plugins'), ignorePattern: /(helper).(ts|js)/ });

server.ready((err) => {
  if (err) throw err;
});

// Add a health check route
server.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

const start = async () => {
  try {
    // Wait for all plugins to be ready before starting
    await server.ready();
    
    const port = parseInt(process.env.PORT || '8080', 10);
    await server.listen({
      port: port,
      host: '0.0.0.0',
      backlog: 511
    });
    
    const address = server.server.address();
    server.log.info(`Server listening at ${typeof address === 'string' ? address : JSON.stringify(address)}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Handle graceful shutdown
const closeGracefully = async (signal) => {
  server.log.info(`Received signal to terminate: ${signal}`);
  
  try {
    await server.close();
    process.exit(0);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

process.on('SIGINT', () => closeGracefully('SIGINT'));
process.on('SIGTERM', () => closeGracefully('SIGTERM'));

start();
