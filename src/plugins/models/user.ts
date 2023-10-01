import fp from 'fastify-plugin';

export default fp((fastify, _, done) => {
  done();
});

declare module 'fastify' {
  export interface FastifyInstance {
    user: {
      get(options: { id: string }): Promise<iUser>;
      set(options: { id: string; data: iUser | string }): Promise<'OK'>;
    };
  }
}
