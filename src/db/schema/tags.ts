import { relations } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { postTags } from './post-tags';
import { tagTranslations } from './tag-translations';

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  color: varchar('color', { length: 7 }).default('#000000'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const tagsRelations = relations(tags, ({ many }) => ({
  translations: many(tagTranslations),
  postTags: many(postTags),
}));
