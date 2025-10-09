import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { BaseService } from 'src/shared/types/base-service';
import { I18nTranslations } from 'src/i18n/i18n.generated';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { UpdateTagRequest } from 'src/features/tags/dto/requests/update-tag.request';
import { IdResponse } from 'src/shared/dto/id.response';
import { tags } from 'src/db/schema/tags';
import { tagTranslations } from 'src/db/schema/tag-translations';
import { eq, and, inArray, or } from 'drizzle-orm';

@Injectable()
export class UpdateTagService implements BaseService<IdResponse> {
  constructor(
    @Inject(DatabaseService) private readonly db: Database,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async execute(params: { id: string; request: UpdateTagRequest }) {
    const { id, request } = params;

    await this.validateTagExists(id);
    await this.validateUniqueConstraints(request);

    return await this.db.transaction(async (tx) => {
      await tx
        .update(tags)
        .set({
          color: request.color,
          isActive: request.isActive,
        })
        .where(eq(tags.id, id));

      const existingTranslations = await tx
        .select({ id: tagTranslations.id })
        .from(tagTranslations)
        .where(eq(tagTranslations.tagId, id));

      const translationsToUpdate = request.translations.filter((t) => t.id);
      const translationsToCreate = request.translations.filter((t) => !t.id);
      const existingIds = existingTranslations.map((t) => t.id);
      const providedIds = translationsToUpdate.map((t) => t.id!);
      const translationsToDelete = existingIds.filter(
        (id) => !providedIds.includes(id),
      );

      if (translationsToDelete.length > 0) {
        await tx
          .delete(tagTranslations)
          .where(inArray(tagTranslations.id, translationsToDelete));
      }

      for (const translation of translationsToUpdate) {
        if (!existingIds.includes(translation.id!)) {
          continue;
        }

        await tx
          .update(tagTranslations)
          .set({
            name: translation.name,
            slug: translation.slug,
          })
          .where(eq(tagTranslations.id, translation.id!));
      }

      if (translationsToCreate.length > 0) {
        await tx.insert(tagTranslations).values(
          translationsToCreate.map((translation) => ({
            tagId: id,
            languageId: translation.languageId,
            name: translation.name,
            slug: translation.slug,
          })),
        );
      }

      return { id };
    });
  }

  private async validateTagExists(id: string) {
    const [tag] = await this.db
      .select({ id: tags.id })
      .from(tags)
      .where(eq(tags.id, id))
      .limit(1);

    if (!tag) {
      throw new NotFoundException(this.i18n.t('tags.errors.not_found'));
    }
  }

  private async validateUniqueConstraints(request: UpdateTagRequest) {
    if (request.translations.length === 0) return;

    const slugLanguage = request.translations.map((t) => ({
      slug: t.slug,
      languageId: t.languageId,
      id: t.id,
    }));

    const orConditions = slugLanguage.map((pair) =>
      and(
        eq(tagTranslations.slug, pair.slug),
        eq(tagTranslations.languageId, pair.languageId),
      ),
    );

    const existingSlugs = await this.db
      .select({
        id: tagTranslations.id,
        slug: tagTranslations.slug,
        languageId: tagTranslations.languageId,
      })
      .from(tagTranslations)
      .where(or(...orConditions));

    for (const translation of request.translations) {
      const conflict = existingSlugs.find(
        (existing) =>
          existing.slug === translation.slug &&
          existing.languageId === translation.languageId &&
          (!translation.id || existing.id !== translation.id),
      );

      if (conflict) {
        throw new ConflictException(this.i18n.t('tags.errors.slug_exists'));
      }
    }
  }
}
