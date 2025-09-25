import { get } from 'env-var';

export function envs() {
  return {
    PORT: get('PORT').required().asPortNumber(),
    NODE_ENV: get('NODE_ENV').default('development').asString(),
    CORS_ORIGINS: get('CORS_ORIGINS').default('').asString().split(','),
  };
}

export type Envs = ReturnType<typeof envs>;
