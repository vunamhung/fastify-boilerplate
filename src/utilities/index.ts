import { env } from '~/utilities/env';

export * from './env';
export * from './constants';
export * from './ramdaExtension';

export const cookieOptions = {
  path: '/',
  secure: !env.isDev, // send cookie over HTTPS only
  httpOnly: true,
  sameSite: true, // alternative CSRF protection
};

export function randomDigit(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function getLimit(page: string, size: string) {
  return { from: (Number(page) - 1) * Number(size), size };
}

export function convertType(value: string) {
  const maps: { [index: string]: any } = { NaN, null: null, undefined, Infinity, '-Infinity': -Infinity };
  return value in maps ? maps[value] : value;
}
