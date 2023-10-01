import { env } from '~/utilities/env';

export * from './env';
export * from './ramda-extension';

export const cookieOptions = {
  path: '/',
  secure: !env.isDev, // send cookie over HTTPS only
  httpOnly: true,
  sameSite: true, // alternative CSRF protection
};
