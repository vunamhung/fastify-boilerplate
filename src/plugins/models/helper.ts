import { app } from '~/server';
import slugify from 'slugify';

export function model<T>(prefix: string) {
  const { redis } = app;

  const key = (rawId: string) => {
    const id = slugify(rawId.toString(), { strict: true });

    return `${prefix}:${id}`;
  };

  const set = ({ id, path = '.', data, timestamp = false }) => {
    let finalData = data;

    if (timestamp) {
      if (data?.createdAt) {
        finalData = { ...data, updatedAt: Date.now() };
      } else {
        finalData = { ...data, createdAt: Date.now(), updatedAt: Date.now() };
      }
    }

    return redis.json.set(key(id), path, finalData);
  };

  const get: Get<T> = async ({ id, path = '.' }) => redis.json.get(key(id), { path, NOESCAPE: true }) as T;

  return { set, get };
}

type Get<T> = (options: { id: string; path?: string }) => Promise<T>;
