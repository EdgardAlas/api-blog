import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/shared/types/base-service';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { LanguageResponse } from 'src/features/languages/dto/responses/language.response';
import { languages } from 'src/db/schema/languages';
import { postTranslations } from 'src/db/schema/post-translations';
import { eq, count, getTableColumns } from 'drizzle-orm';

@Injectable()
export class GetLanguageService implements BaseService<LanguageResponse> {
  constructor(@Inject(DatabaseService) private readonly db: Database) {}

  async execute(id: string): Promise<LanguageResponse> {
    const [languageWithCount] = await this.db
      .select({
        ...getTableColumns(languages),
        postsCount: count(postTranslations.id),
      })
      .from(languages)
      .leftJoin(postTranslations, eq(languages.id, postTranslations.languageId))
      .where(eq(languages.id, id))
      .groupBy(
        languages.id,
        languages.name,
        languages.code,
        languages.isDefault,
        languages.isActive,
        languages.createdAt,
        languages.updatedAt,
      );

    if (!languageWithCount) {
      throw new NotFoundException('Language not found');
    }

    return new LanguageResponse(languageWithCount);
  }
}
