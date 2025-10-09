import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { BaseService } from 'src/shared/types/base-service';
import { I18nTranslations } from 'src/i18n/i18n.generated';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { IdResponse } from 'src/shared/dto/id.response';
import { tags } from 'src/db/schema/tags';
import { eq } from 'drizzle-orm';

@Injectable()
export class DeleteTagService implements BaseService<IdResponse> {
  constructor(
    @Inject(DatabaseService) private readonly db: Database,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async execute(id: string) {
    const [result] = await this.db
      .delete(tags)
      .where(eq(tags.id, id))
      .returning({ id: tags.id });

    if (!result) {
      throw new NotFoundException(this.i18n.t('tags.errors.not_found'));
    }

    return { id: result.id };
  }
}
