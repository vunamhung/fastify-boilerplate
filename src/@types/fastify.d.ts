import type { AxiosRequestConfig, AxiosResponse } from 'axios';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id?: string }; // payload type is used for signing and verifying
  }
}

declare module 'fastify' {
  export interface FastifyInstance {
    axios: {
      get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
      post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
      put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R>;
    };
  }
}
