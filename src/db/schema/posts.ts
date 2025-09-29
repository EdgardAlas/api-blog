import { relations } from 'drizzle-orm';
import { bigint, boolean, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { authors } from './authors';
import { postStatusEnum } from './enums';
import { media } from './media';
import { postTags } from './post-tags';
import { postTranslations } from './post-translations';
import { users } from './users';

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  authorId: uuid('author_id')
    .notNull()
    .references(() => authors.id),
  createdBy: uuid('created_by').references(() => users.id),
  featuredImageId: uuid('featured_image_id').references(() => media.id),
  status: postStatusEnum('status').default('draft'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  isFeatured: boolean('is_featured').default(false),
  viewCount: bigint('view_count', { mode: 'number' }).default(0),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(authors, {
    fields: [posts.authorId],
    references: [authors.id],
  }),
  createdByUser: one(users, {
    fields: [posts.createdBy],
    references: [users.id],
    relationName: 'CreatedBy',
  }),
  featuredImage: one(media, {
    fields: [posts.featuredImageId],
    references: [media.id],
    relationName: 'FeaturedImage',
  }),
  translations: many(postTranslations),
  postTags: many(postTags),
}));
