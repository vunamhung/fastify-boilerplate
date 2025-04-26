import { generalFields, responseWithPaginate } from './helper';
import { z } from 'zod';

export const userSchema = z.object({
  username: z.string().min(3).max(32).toLowerCase(),
  deleted: z.boolean().optional(),
  enabled: z.boolean().default(true),
  email: z.string().email(),
  password: z.string(),
  role: z.string(),
  refreshToken: z.string().optional(),
  signupToken: z.string().optional(),
  resetPasswordToken: z.string().optional(),
  verified: z.boolean().default(true),
  fullName: z.string(),
  about: z.string().optional(),
  avatar: z.string().optional(),
});

export const createUserSchema = userSchema.omit({ refreshToken: true, signupToken: true, resetPasswordToken: true });
export const updateUserSchema = createUserSchema.deepPartial();
export const getUserSchema = createUserSchema.omit({ password: true }).merge(generalFields).deepPartial();
export const getAllUserSchema = responseWithPaginate(getUserSchema);
