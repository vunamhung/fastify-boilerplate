import { zId } from '~/utils/zod-mongoose';
import { z } from 'zod';

export { zId } from '~/utils/zod-mongoose';

export const responseWithPaginate = (doc: any) => {
  return z.object({
    docs: z.array(doc),
    totalDocs: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    page: z.number().optional(),
    pagingCounter: z.number(),
    hasPrevPage: z.boolean(),
    hasNextPage: z.boolean(),
    prevPage: z.number().nullish(),
    nextPage: z.number().nullish(),
  });
};

export const params = z.object({
  id: zId,
});

export const querystring = z.object({
  keyword: z.string().optional(),
  deleted: z.enum(['true', 'false']).optional(),
  sort: z.string().optional(),
  page: z.string().default('1'),
  limit: z.string().default('10'),
  fields: z.string().optional(),
});

export const generalFields = z.object({
  id: zId,
  deleted: z.boolean().optional(),
  deletedBy: z.string().optional(),
  deletedAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const responseError = z
  .object({
    statusCode: z.number().min(400).max(500),
    error: z.string(),
    message: z.string(),
  })
  .describe('Error response');

export const responseSuccess = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const loginSuccess = z.object({
  token: z.string(),
  expiration: z.any(),
});

export const location = z
  .object({
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  })
  .optional();

export const banks = z
  .array(
    z.object({
      name: z.string().trim(),
      iban: z.string().trim().optional(),
      swift: z.string().trim().optional(),
      number: z.string().trim().optional(),
      routing: z.string().trim().optional(),
      country: z.string().trim(),
    }),
  )
  .optional();

export const customFields = z
  .array(
    z.object({
      name: z.string().trim().toLowerCase(),
      type: z.string().trim().toLowerCase(),
      value: z.string().trim(),
    }),
  )
  .optional();

export const address = z
  .object({
    address1: z.string().trim(),
    address2: z.string().trim().optional(),
    email: z.string().trim().optional(),
    otherEmail: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    otherPhone: z.string().trim().optional(),
    fax: z.string().trim().optional(),
  })
  .optional();
