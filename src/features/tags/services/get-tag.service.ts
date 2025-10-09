import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { eq, count } from 'drizzle-orm';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { tags } from 'src/db/schema/tags';
import { tagTranslations } from 'src/db/schema/tag-translations';
import { postTags } from 'src/db/schema/post-tags';
import { BaseService } from 'src/shared/types/base-service';
import { I18nTranslations } from 'src/i18n/i18n.generated';
import {
  TagResponse,
  TagTranslationResponse,
} from 'src/features/tags/dto/responses/tag.response';

@Injectable()
export class GetTagService implements BaseService<TagResponse> {
  constructor(
    @Inject(DatabaseService) private readonly db: Database,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async execute(id: string) {
    const tag = await this.db
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
      .leftJoin(tagTranslations, eq(tags.id, tagTranslations.tagId))
      .leftJoin(postTags, eq(tags.id, postTags.tagId))
      .where(eq(tags.id, id))
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
      );

    if (!tag || tag.length === 0) {
      throw new NotFoundException(this.i18n.t('tags.errors.not_found'));
    }

    const mainTag = tag[0];

    return new TagResponse({
      id: mainTag.id,
      color: mainTag.color,
      isActive: mainTag.isActive,
      createdAt: mainTag.createdAt,
      updatedAt: mainTag.updatedAt,
      postCount: mainTag.postCount,
      translations: tag
        .filter((row) => row.translationId)
        .map(
          (row) =>
            new TagTranslationResponse({
              id: row.translationId!,
              languageId: row.languageId!,
              name: row.name!,
              slug: row.slug!,
              createdAt: row.translationCreatedAt!,
            }),
        ),
    });
  }
}
