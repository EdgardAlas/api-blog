import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { BaseService } from 'src/shared/types/base-service';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { CreateTagRequest } from 'src/features/tags/dto/requests/create-tag.request';
import { IdResponse } from 'src/shared/dto/id.response';
import { tags } from 'src/db/schema/tags';
import { tagTranslations } from 'src/db/schema/tag-translations';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class CreateTagService implements BaseService<IdResponse> {
  constructor(@Inject(DatabaseService) private readonly db: Database) {}

  async execute(request: CreateTagRequest) {
    await this.validateUniqueConstraints(request);

    return await this.db.transaction(async (tx) => {
      const [result] = await tx
        .insert(tags)
        .values({
          color: request.color,
          isActive: request.isActive,
        })
        .returning({ id: tags.id });

      await tx.insert(tagTranslations).values(
        request.translations.map((translation) => ({
          tagId: result.id,
          languageId: translation.languageId,
          name: translation.name,
          slug: translation.slug,
        })),
      );

      return { id: result.id };
    });
  }

  private async validateUniqueConstraints(request: CreateTagRequest) {
    for (const translation of request.translations) {
      const existingSlug = await this.db
        .select({ id: tagTranslations.id })
        .from(tagTranslations)
        .where(
          and(
            eq(tagTranslations.slug, translation.slug),
            eq(tagTranslations.languageId, translation.languageId),
          ),
        )
        .limit(1);

      if (existingSlug.length > 0) {
        throw new ConflictException('Tag slug already exists');
      }
    }
  }
}
