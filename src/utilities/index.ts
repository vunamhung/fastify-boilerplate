import { genSalt, hash } from 'bcryptjs';
import Option from '../models/Option';

export const MINUTE_IN_SECONDS = 60 * 1000;
export const HOUR_IN_SECONDS = 60 * MINUTE_IN_SECONDS;
export const DAY_IN_SECONDS = 24 * HOUR_IN_SECONDS;
export const WEEK_IN_SECONDS = 7 * DAY_IN_SECONDS;

export async function validateToken(request, decodedToken) {
  if (decodedToken.user.banned) return false;

  const banUsers = await Option.findOne({ name: 'ban_users' });

  return !banUsers?.data?.includes(decodedToken.user.email);
}

export async function hashPassword(password) {
  const salt = await genSalt();
  return await hash(password, salt);
}
