import { cleanEnv, num, str } from 'envalid';

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  PORT: num({ default: 8080 }),
  HOST: str({ default: '0.0.0.0' }),
  ACCESS_TOKEN_SECRET: str(),
  REDIS_URL: str(),
  CORS_ORIGIN: str(),
  TELEGRAM_BOT_API_KEY: str(),
});
