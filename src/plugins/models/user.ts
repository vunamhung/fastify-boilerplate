import { model } from '~/models/helper';
import fp from 'fastify-plugin';

export default fp((fastify, _, done) => {
  fastify.decorate('user', model('user'));
  done();
});

declare module 'fastify' {
  export interface FastifyInstance {
    user: {
      get(options: { id: string; path?: string }): Promise<iUser>;
      set(options: { id: string; data: any; path?: string; timestamp?: boolean }): Promise<'OK'>;
    };
  }
}
