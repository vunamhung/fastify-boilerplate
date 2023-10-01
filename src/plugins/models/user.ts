import fp from 'fastify-plugin';

export default fp((fastify, _, done) => {
  done();
});

declare module 'fastify' {
  export interface FastifyInstance {
    user: {
      get(options: { id: string }): Promise<iToken>;
      set(options: { id: string; data: iToken | string }): Promise<'OK'>;
    };
  }
}
