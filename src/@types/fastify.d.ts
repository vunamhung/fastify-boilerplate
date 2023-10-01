import type { AxiosRequestConfig, AxiosResponse } from 'axios';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      id?: string;
      permissions?: string[];
      auth?: string;
      email?: string;
      fullName?: string;
    };
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
