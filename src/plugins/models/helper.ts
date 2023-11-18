import type { RedisClientType, SearchOptions } from 'redis';
import { server } from '~/server';
import slugify from 'slugify';

export function model<T>(prefix: string) {
  const redis: RedisClientType = server.redis;

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

  const get: Get<T> = async ({ id, path = '.' }) => (await redis.json.get(key(id), { path, NOESCAPE: true })) as T;

  const search: Search<T> = async ({ query, options }) => (await redis.ft.search(`idx:${prefix}`, query, options)) as iSearch<T>;

  return { set, get, search };
}

type Get<T> = (options: { id: string; path?: string }) => Promise<T>;
type Search<T> = (options: { query?: string; options?: SearchOptions }) => Promise<iSearch<T>>;
