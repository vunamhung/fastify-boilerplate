import { Types } from 'mongoose';

export const NOW_IN_SECONDS = Date.now();
export const MINUTE_IN_SECONDS = 60 * 1000;
export const HOUR_IN_SECONDS = 60 * MINUTE_IN_SECONDS;
export const DAY_IN_SECONDS = 24 * HOUR_IN_SECONDS;
export const WEEK_IN_SECONDS = 7 * DAY_IN_SECONDS;

export const DUPLICATE_KEY_ERROR = 11000;

export function isObjectId(id) {
  return Types.ObjectId.isValid(id);
}
