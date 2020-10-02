import { genSalt, hash } from 'bcryptjs';

export const MINUTE_IN_SECONDS = 60 * 1000;
export const HOUR_IN_SECONDS = 60 * MINUTE_IN_SECONDS;
export const DAY_IN_SECONDS = 24 * HOUR_IN_SECONDS;
export const WEEK_IN_SECONDS = 7 * DAY_IN_SECONDS;

export async function hashPassword(password) {
  const salt = await genSalt();
  return await hash(password, salt);
}
