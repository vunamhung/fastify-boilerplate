import { env } from '~/utilities/env';

export * from './env';
export * from './permissions';
export * from './ramda-extension';

export const cookieOptions = {
  path: '/',
  secure: !env.isDev, // send cookie over HTTPS only
  httpOnly: true,
  sameSite: true, // alternative CSRF protection
};

export function randomDigit(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}
