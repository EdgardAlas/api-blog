import { relations } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { postTranslations } from './post-translations';
import { tagTranslations } from './tag-translations';

export const languages = pgTable('languages', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 5 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  isDefault: boolean('is_default').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const languagesRelations = relations(languages, ({ many }) => ({
  postTranslations: many(postTranslations),
  tagTranslations: many(tagTranslations),
}));
