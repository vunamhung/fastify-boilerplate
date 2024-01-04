import type { ZFastify } from '~/@types';
import type { SearchOptions } from 'redis';
import { model } from '~/models/helper';
import fp from 'fastify-plugin';

export default fp((fastify: ZFastify, _, done) => {
  fastify.decorate('user', model<iUser>('user'));
  done();
});

declare module 'fastify' {
  export interface FastifyInstance {
    user: {
      get(options: { id: string; path?: string }): Promise<iUser>;
      set(options: { id: string; data: any; path?: string; timestamp?: boolean }): Promise<'OK'>;
      search(options: { query: string; options?: SearchOptions }): Promise<iSearch<iUser>>;
    };
  }
}
