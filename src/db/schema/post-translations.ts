import { relations } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { languages } from './languages';
import { posts } from './posts';

export const postTranslations = pgTable(
  'post_translations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    postId: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    languageId: uuid('language_id')
      .notNull()
      .references(() => languages.id),
    slug: varchar('slug', { length: 255 }).notNull(),
    title: varchar('title', { length: 500 }).notNull(),
    content: text('content').notNull(),
    metaTitle: varchar('meta_title', { length: 60 }),
    metaDescription: varchar('meta_description', { length: 160 }),
    metaKeywords: text('meta_keywords'),
    isPublished: boolean('is_published').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    postLanguageUnique: unique().on(t.postId, t.languageId),
    slugLanguageUnique: unique().on(t.slug, t.languageId),
  }),
);

export const postTranslationsRelations = relations(
  postTranslations,
  ({ one }) => ({
    post: one(posts, {
      fields: [postTranslations.postId],
      references: [posts.id],
    }),
    language: one(languages, {
      fields: [postTranslations.languageId],
      references: [languages.id],
    }),
  }),
);
