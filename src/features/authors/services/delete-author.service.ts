import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { BaseService } from 'src/shared/types/base-service';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { IdResponse } from 'src/shared/dto/id.response';
import { authors } from 'src/db/schema/authors';
import { eq } from 'drizzle-orm';
import { I18nTranslations } from 'src/i18n/i18n.generated';

@Injectable()
export class DeleteAuthorService implements BaseService<string, IdResponse> {
  constructor(
    @Inject(DatabaseService) private readonly db: Database,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async execute(id: string) {
    const [result] = await this.db
      .delete(authors)
      .where(eq(authors.id, id))
      .returning({ id: authors.id });

    if (!result) {
      throw new NotFoundException(this.i18n.t('authors.errors.not_found'));
    }

    return { id: result.id };
  }
}
