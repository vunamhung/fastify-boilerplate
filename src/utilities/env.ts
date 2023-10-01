import { cleanEnv, num, str } from 'envalid';

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  ACCESS_TOKEN_SECRET: str(),
  REDIS_URL: str(),
  CORS_ORIGIN: str(),
  PORT: num({ default: 3000 }),
});
