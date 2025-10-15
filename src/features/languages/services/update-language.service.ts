import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { BaseService } from 'src/shared/types/base-service';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { UpdateLanguageRequest } from 'src/features/languages/dto/requests/update-language.request';
import { IdResponse } from 'src/shared/dto/id.response';
import { languages } from 'src/db/schema/languages';
import { eq, ne, and } from 'drizzle-orm';

interface UpdateLanguageParams {
  id: string;
  request: UpdateLanguageRequest;
}

@Injectable()
export class UpdateLanguageService implements BaseService<IdResponse> {
  constructor(@Inject(DatabaseService) private readonly db: Database) {}

  async execute({ id, request }: UpdateLanguageParams) {
    await this.validateLanguageExists(id);
    await this.validateUniqueConstraints(id, request);

    const [result] = await this.db
      .update(languages)
      .set({
        code: request.code,
        name: request.name,
        isDefault: request.isDefault,
        isActive: request.isActive,
      })
      .where(eq(languages.id, id))
      .returning({ id: languages.id });

    if (!result) {
      throw new NotFoundException('Language not found');
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
      throw new NotFoundException('Language not found');
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
      throw new ConflictException('Language code already exists');
    }
  }
}
