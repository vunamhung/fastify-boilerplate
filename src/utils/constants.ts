import { env } from '.';

export const EXCLUDE_DATA = '-password -refreshToken -signupToken -deleted -__v -_id';

export const CREATE = 'create';
export const READ = 'read';
export const UPDATE = 'update';

export const expiresIn = env.isDev ? '60d' : '10m';

export const cookieOptions = {
  path: '/',
  secure: !env.isDev, // send cookie over HTTPS only
  httpOnly: true,
  sameSite: true, // alternative CSRF protection
};

export const roles = {
  reader: { can: ['*:read'] },
  author: { can: ['post:*', 'page:*'] },
  editor: { can: ['user:*'], inherits: ['author', 'reader'] },
  admin: { can: ['*'] },
};
