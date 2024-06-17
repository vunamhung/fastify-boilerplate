import { cleanEnv, num, str } from 'envalid';

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  PORT: num({ default: 3000 }),
  ACCESS_TOKEN_SECRET: str(),
  CORS_ORIGIN: str(),
  MONGO_URI: str(),
});
