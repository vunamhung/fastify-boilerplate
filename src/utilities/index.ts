import { genSalt, hash } from 'bcryptjs';
import { Types } from 'mongoose';
import PasswordValidator from 'password-validator';
import { isEmpty } from 'ramda';

export const NOW_IN_SECONDS = Date.now();
export const MINUTE_IN_SECONDS = 60 * 1000;
export const HOUR_IN_SECONDS = 60 * MINUTE_IN_SECONDS;
export const DAY_IN_SECONDS = 24 * HOUR_IN_SECONDS;
export const WEEK_IN_SECONDS = 7 * DAY_IN_SECONDS;

export const DUPLICATE_KEY_ERROR = 11000;

export async function validatePassword(password): Promise<string[]> {
  const schema = new PasswordValidator();
  // prettier-ignore
  schema
    .is().min(8) // Minimum length 8
    .is().max(100) // Maximum length 100
    .has().uppercase() // Must have uppercase letters
    .has().lowercase() // Must have lowercase letters
    .has().digits(2) // Must have at least 2 digits
    .has().not().spaces() // Should not have spaces

  const validPassword: string[] = schema.validate(password, { list: true });

  let message = [];
  if (!isEmpty(validPassword)) {
    validPassword.forEach((item) => {
      if (item === 'min') message.push('Minimum length 8.');
      if (item === 'max') message.push('Maximum length 100.');
      if (item === 'digits') message.push('Must have at least 2 digits.');
      if (item === 'spaces') message.push('Should not have spaces.');
      if (item === 'lowercase') message.push('Must have lowercase letters.');
      if (item === 'uppercase') message.push('Must have uppercase letters.');
    });
  }

  return message;
}

export async function hashPassword(password): Promise<string> {
  const salt = await genSalt();
  return await hash(password, salt);
}

export function isObjectId(id) {
  return Types.ObjectId.isValid(id);
}
