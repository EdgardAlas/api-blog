import { Inject, Injectable } from '@nestjs/common';
import { ilike, or, count, eq, getTableColumns } from 'drizzle-orm';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { languages } from 'src/db/schema/languages';
import { postTranslations } from 'src/db/schema/post-translations';
import { BaseService } from 'src/shared/types/base-service';
import {
  createPagination,
  getPaginationParams,
} from 'src/shared/utils/pagination.utils';
import { GetLanguagesQuery } from 'src/features/languages/dto/requests/get-languages.query';
import { LanguageResponse } from 'src/features/languages/dto/responses/language.response';
import { GetLanguagesResponse } from 'src/features/languages/dto/responses/get-languages.response';

@Injectable()
export class GetLanguagesService implements BaseService<GetLanguagesResponse> {
  constructor(@Inject(DatabaseService) private readonly db: Database) {}

  async execute(query: GetLanguagesQuery) {
    const { page, limit, offset } = getPaginationParams(query);

    const searchCondition = query.search
      ? or(
          ilike(languages.name, `%${query.search}%`),
          ilike(languages.code, `%${query.search}%`),
        )
      : undefined;

    const [data, total] = await Promise.all([
      this.db
        .select({
          ...getTableColumns(languages),
          postsCount: count(postTranslations.id),
        })
        .from(languages)
        .leftJoin(
          postTranslations,
          eq(languages.id, postTranslations.languageId),
        )
        .where(searchCondition)
        .groupBy(
          languages.id,
          languages.code,
          languages.name,
          languages.isDefault,
          languages.isActive,
          languages.createdAt,
          languages.updatedAt,
        )
        .limit(limit)
        .offset(offset),
      this.db.$count(languages, searchCondition),
    ]);

    const mappedData = data.map((language) => new LanguageResponse(language));

    return createPagination(mappedData, total, page, limit);
  }
}
