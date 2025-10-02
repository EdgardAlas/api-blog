import { get } from 'env-var';

export function envs() {
  return {
    PORT: get('PORT').required().asPortNumber(),
    NODE_ENV: get('NODE_ENV').default('development').asString(),
    CORS_ORIGINS: get('CORS_ORIGINS').default('').asString().split(','),
    DATABASE_URL: get('DATABASE_URL').required().asString(),
    JWT_AUTH_SECRET: get('JWT_AUTH_SECRET').required().asString(),
    JWT_AUTH_EXPIRES_IN: get('JWT_AUTH_EXPIRES_IN')
      .default('900')
      .asIntPositive(),
    JWT_REFRESH_SECRET: get('JWT_REFRESH_SECRET').required().asString(),
    JWT_REFRESH_EXPIRES_IN: get('JWT_REFRESH_EXPIRES_IN')
      .default('604800')
      .asIntPositive(),
  };
}

export type Envs = ReturnType<typeof envs>;
