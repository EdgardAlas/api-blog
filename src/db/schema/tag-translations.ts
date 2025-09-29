import { relations } from 'drizzle-orm';
import { pgTable, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core';
import { languages } from './languages';
import { tags } from './tags';

export const tagTranslations = pgTable(
  'tag_translations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    languageId: uuid('language_id')
      .notNull()
      .references(() => languages.id),
    slug: varchar('slug', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    tagLanguageUnique: unique().on(t.tagId, t.languageId),
    slugLanguageUnique: unique().on(t.slug, t.languageId),
  }),
);

export const tagTranslationsRelations = relations(
  tagTranslations,
  ({ one }) => ({
    tag: one(tags, {
      fields: [tagTranslations.tagId],
      references: [tags.id],
    }),
    language: one(languages, {
      fields: [tagTranslations.languageId],
      references: [languages.id],
    }),
  }),
);
