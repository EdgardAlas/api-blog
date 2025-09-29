import { get } from 'env-var';

export function envs() {
  return {
    PORT: get('PORT').required().asPortNumber(),
    NODE_ENV: get('NODE_ENV').default('development').asString(),
    CORS_ORIGINS: get('CORS_ORIGINS').default('').asString().split(','),
    DATABASE_URL: get('DATABASE_URL').required().asString(),
  };
}

export type Envs = ReturnType<typeof envs>;
