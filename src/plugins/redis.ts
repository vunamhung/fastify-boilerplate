import { env } from '~/utilities';
import fp from 'fastify-plugin';
import { createClient } from 'redis';

export default fp((fastify, _, done) => {
  const client = createClient({ url: env.REDIS_URL }).on('error', (err) => {
    console.log('Redis Client Error', err);
    fastify.log.error(err);
  });

  fastify.decorate('redis', client);

  fastify.addHook('onClose', ({ redis }, done) => {
    redis.quit();
    done();
  });

  done();
});

declare module 'fastify' {
  export interface FastifyInstance {
    redis: ReturnType<typeof createClient>;
  }
}
