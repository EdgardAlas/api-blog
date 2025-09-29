import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { posts } from './posts';
import { users } from './users';

export const media = pgTable('media', {
  id: uuid('id').primaryKey().defaultRandom(),
  filename: varchar('filename', { length: 255 }).notNull(),
  originalFilename: varchar('original_filename', { length: 255 }).notNull(),
  url: text('url').notNull(),
  folder: varchar('folder', { length: 255 }).default('uploads'),
  uploadedBy: uuid('uploaded_by')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const mediaRelations = relations(media, ({ one, many }) => ({
  uploadedByUser: one(users, {
    fields: [media.uploadedBy],
    references: [users.id],
  }),
  featuredInPosts: many(posts, { relationName: 'FeaturedImage' }),
}));
