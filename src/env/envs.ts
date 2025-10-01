import { get } from 'env-var';

export function envs() {
  return {
    PORT: get('PORT').required().asPortNumber(),
    NODE_ENV: get('NODE_ENV').default('development').asString(),
    CORS_ORIGINS: get('CORS_ORIGINS').default('').asString().split(','),
    DATABASE_URL: get('DATABASE_URL').required().asString(),
    JWT_SECRET: get('JWT_SECRET').required().asString(),
    JWT_EXPIRES_IN: get('JWT_EXPIRES_IN').default('900').asString(),
    JWT_REFRESH_SECRET: get('JWT_REFRESH_SECRET').required().asString(),
    JWT_REFRESH_EXPIRES_IN: get('JWT_REFRESH_EXPIRES_IN')
      .default('604800')
      .asString(),
  };
}

export type Envs = ReturnType<typeof envs>;
