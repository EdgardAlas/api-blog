import { SetMetadata } from '@nestjs/common';

export const Rol = {
  ADMIN: 'admin',
  EDITOR: 'editor',
} as const;

export type Roles = (typeof Rol)[keyof typeof Rol];

export const ROLES_DECORATOR_NAME = 'roles';

export const Roles = (...args: Roles[]) =>
  SetMetadata(ROLES_DECORATOR_NAME, args);
