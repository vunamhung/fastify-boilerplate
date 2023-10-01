import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { Redis } from 'redis-modules-sdk';

export default fp((fastify: FastifyInstance, options, done) => {
  const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;
  const redis = new Redis({ host: REDIS_HOST, port: REDIS_PORT, password: REDIS_PASSWORD }, { showDebugLogs: false, returnRawResponse: true });
  fastify.decorate('redis', redis);

  fastify.addHook('onClose', async ({ redis }, done) => {
    await redis.disconnect();
    done();
  });

  done();
});

declare module 'fastify' {
  export interface FastifyInstance {
    redis: Redis;
  }
}
