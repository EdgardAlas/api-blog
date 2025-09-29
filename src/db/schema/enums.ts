import { pgEnum } from 'drizzle-orm/pg-core';

export const postStatusEnum = pgEnum('post_status', [
  'draft',
  'published',
  'archived',
]);

export const userRoleEnum = pgEnum('user_role', ['admin', 'editor']);
