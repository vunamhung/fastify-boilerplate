import PasswordValidator from 'password-validator';
import { isArray } from 'ramda-adjunct';

export { env } from './env';
export * from './constants';
export { between, containsAny } from './ramdaExtension';

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

export async function validatePassword(password: string) {
  const schema = new PasswordValidator();
  // prettier-ignore
  schema
    .is().min(8) // Minimum length 8
    .is().max(50) // Maximum length 50
    .has().uppercase() // Must have uppercase letters
    .has().lowercase() // Must have lowercase letters
    .has().digits(1) // Must have at least 1 digits

  const validPassword = schema.validate(password, { list: true });

  let message = [];
  if (isArray(validPassword)) {
    validPassword.forEach((item) => {
      if (item === 'min') message.push('Minimum length 8.');
      if (item === 'max') message.push('Maximum length 50.');
      if (item === 'digits') message.push('Must have at least 1 digits.');
      if (item === 'lowercase') message.push('Must have lowercase letters.');
      if (item === 'uppercase') message.push('Must have uppercase letters.');
    });
  }

  return message.join(',');
}
