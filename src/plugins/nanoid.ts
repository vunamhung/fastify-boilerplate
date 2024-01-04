import type { ZFastify } from '~/@types';
import fp from 'fastify-plugin';
import { customAlphabet } from 'nanoid';

export default fp((fastify: ZFastify, _, done) => {
  let id = (size = 10) => customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', size)();
  let coupon = (size = 6) => customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', size)();
  fastify.decorate('nano', { id, coupon });

  done();
});

declare module 'fastify' {
  export interface FastifyInstance {
    nano: {
      id(size?: number): string;
      coupon(size?: number): string;
    };
  }
}
