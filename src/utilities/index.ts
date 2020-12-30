import { genSalt, hash } from 'bcryptjs';
import { Types } from 'mongoose';
import PasswordValidator from 'password-validator';
import { isEmpty } from 'ramda';
import jwt from 'jsonwebtoken';

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

export interface iToken {
  id: string;
  email: string;
  role: string;
  auth: string;
  verified?: boolean;
  jti: string;
}

export interface iQuery {
  limit?: number;
  skip?: number;
}

export interface iBody {
  code?: string;
  id?: string;
  token?: string;
  oldPassword?: string;
  newPassword?: string;
  email?: string;
  password?: string;
  verified?: string;
  cartId?: string;
  orderId?: string;
  sku?: string;
  productId?: string;
  products?: string;
  quantity?: number;
  name?: string;
}

export interface iParams extends iBody {}

interface iJwtToken {
  jti: string;
}

export const signRefreshToken = (jti: string) => jwt.sign({}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d', jwtid: jti });
export const verifyRefreshToken = (token: string) => jwt.verify(token, process.env.REFRESH_TOKEN_SECRET) as iJwtToken;
export const signSignupToken = (jti: string) => jwt.sign({}, process.env.VERIFY_TOKEN_SECRET, { expiresIn: '7d', jwtid: jti });
export const verifySignupToken = (token: string) => jwt.verify(token, process.env.VERIFY_TOKEN_SECRET) as iJwtToken;
export const signResetPasswordToken = (jti: string) => jwt.sign({}, process.env.RESET_PASSWORD_TOKEN_SECRET, { expiresIn: '4h', jwtid: jti });
export const verifyResetPasswordToken = (token: string) => jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_SECRET) as iJwtToken;
