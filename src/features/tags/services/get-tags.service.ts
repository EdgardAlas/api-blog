import { Inject, Injectable } from '@nestjs/common';
import { eq, ilike, or, count } from 'drizzle-orm';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { tagTranslations } from 'src/db/schema/tag-translations';
import { tags } from 'src/db/schema/tags';
import { postTags } from 'src/db/schema/post-tags';
import { GetTagsQuery } from 'src/features/tags/dto/requests/get-tags.query';
import { GetTagsResponse } from 'src/features/tags/dto/responses/get-tags.response';
import {
  TagResponse,
  TagTranslationResponse,
} from 'src/features/tags/dto/responses/tag.response';
import { BaseService } from 'src/shared/types/base-service';
import {
  createPagination,
  getPaginationParams,
} from 'src/shared/utils/pagination.utils';

@Injectable()
export class GetTagsService implements BaseService<GetTagsResponse> {
  constructor(@Inject(DatabaseService) private readonly db: Database) {}

  async execute(query: GetTagsQuery) {
    const { page, limit, offset } = getPaginationParams(query);

    const searchCondition = query.search
      ? or(
          ilike(tagTranslations.name, `%${query.search}%`),
          ilike(tagTranslations.slug, `%${query.search}%`),
        )
      : undefined;

    const langCondition = query.lang
      ? eq(tagTranslations.languageId, query.lang)
      : undefined;

    const whereConditions = [searchCondition, langCondition].filter(Boolean);
    const whereClause =
      whereConditions.length > 0
        ? whereConditions.reduce((acc, condition) => acc && condition)
        : undefined;

    const [data, total] = await Promise.all([
      this.db
        .select({
          id: tags.id,
          color: tags.color,
          isActive: tags.isActive,
          createdAt: tags.createdAt,
          updatedAt: tags.updatedAt,
          postCount: count(postTags.id),
          translationId: tagTranslations.id,
          languageId: tagTranslations.languageId,
          name: tagTranslations.name,
          slug: tagTranslations.slug,
          translationCreatedAt: tagTranslations.createdAt,
        })
        .from(tags)
        .innerJoin(tagTranslations, eq(tags.id, tagTranslations.tagId))
        .leftJoin(postTags, eq(tags.id, postTags.tagId))
        .where(whereClause)
        .groupBy(
          tags.id,
          tags.color,
          tags.isActive,
          tags.createdAt,
          tags.updatedAt,
          tagTranslations.id,
          tagTranslations.languageId,
          tagTranslations.name,
          tagTranslations.slug,
          tagTranslations.createdAt,
        )
        .limit(limit)
        .offset(offset),
      this.db.$count(tags, whereClause),
    ]);

    const tagsMap = new Map<string, TagResponse>();

    data.forEach((row) => {
      if (!tagsMap.has(row.id)) {
        tagsMap.set(
          row.id,
          new TagResponse({
            id: row.id,
            color: row.color,
            isActive: row.isActive,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            postCount: row.postCount,
            translations: [],
          }),
        );
      }

      tagsMap.get(row.id)!.translations.push(
        new TagTranslationResponse({
          id: row.translationId,
          languageId: row.languageId,
          name: row.name,
          slug: row.slug,
          createdAt: row.translationCreatedAt,
        }),
      );
    });

    const mappedData = Array.from(tagsMap.values());

    return createPagination(mappedData, total, page, limit);
  }
}
