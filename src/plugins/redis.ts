import type { ZFastify } from '~/@types';
import type { RedisClientType } from 'redis';
import { env } from '~/utils';
import fp from 'fastify-plugin';
import { createClient } from 'redis';

export default fp((fastify: ZFastify, _, done) => {
  const client = createClient({ url: env.REDIS_URL }).on('error', (err) => {
    console.log('Redis Client Error', err);
    fastify.log.error(err);
  }) as RedisClientType;

  fastify.decorate('redis', client);

  fastify.addHook('onClose', ({ redis }, done) => {
    redis.quit();
    done();
  });

  done();
});

declare module 'fastify' {
  export interface FastifyInstance {
    redis: RedisClientType;
  }
}
