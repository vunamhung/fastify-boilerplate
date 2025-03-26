declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      username?: string;
      email?: string;
      fullName?: string;
      role?: string;
      jti?: string;
    };
  }
}
