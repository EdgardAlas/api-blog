import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { BaseService } from 'src/shared/types/base-service';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { UpdateLanguageRequest } from 'src/features/languages/dto/requests/update-language.request';
import { IdResponse } from 'src/shared/dto/id.response';
import { languages } from 'src/db/schema/languages';
import { eq, ne, and } from 'drizzle-orm';
import { I18nTranslations } from 'src/i18n/i18n.generated';

interface UpdateLanguageParams {
  id: string;
  updateLanguageRequest: UpdateLanguageRequest;
}

@Injectable()
export class UpdateLanguageService implements BaseService<IdResponse> {
  constructor(
    @Inject(DatabaseService) private readonly db: Database,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async execute({ id, updateLanguageRequest }: UpdateLanguageParams) {
    await this.validateLanguageExists(id);
    await this.validateUniqueConstraints(id, updateLanguageRequest);

    const [result] = await this.db
      .update(languages)
      .set({
        code: updateLanguageRequest.code,
        name: updateLanguageRequest.name,
        isDefault: updateLanguageRequest.isDefault,
        isActive: updateLanguageRequest.isActive,
      })
      .where(eq(languages.id, id))
      .returning({ id: languages.id });

    if (!result) {
      throw new NotFoundException(this.i18n.t('languages.errors.not_found'));
    }

    return { id: result.id };
  }

  private async validateLanguageExists(id: string) {
    const [existingLanguage] = await this.db
      .select({ id: languages.id })
      .from(languages)
      .where(eq(languages.id, id))
      .limit(1);

    if (!existingLanguage) {
      throw new NotFoundException(this.i18n.t('languages.errors.not_found'));
    }
  }

  private async validateUniqueConstraints(
    id: string,
    request: UpdateLanguageRequest,
  ) {
    if (!request.code) {
      return;
    }

    const existingCode = await this.db
      .select({ id: languages.id })
      .from(languages)
      .where(and(ne(languages.id, id), eq(languages.code, request.code)))
      .limit(1);

    if (existingCode.length > 0) {
      throw new ConflictException(this.i18n.t('languages.errors.code_exists'));
    }
  }
}
