import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { BaseService } from 'src/shared/types/base-service';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { CreateLanguageRequest } from 'src/features/languages/dto/requests/create-language.request';
import { IdResponse } from 'src/shared/dto/id.response';
import { languages } from 'src/db/schema/languages';
import { eq } from 'drizzle-orm';

@Injectable()
export class CreateLanguageService implements BaseService<IdResponse> {
  constructor(@Inject(DatabaseService) private readonly db: Database) {}

  async execute(request: CreateLanguageRequest) {
    await this.validateUniqueConstraints(request);

    const [result] = await this.db
      .insert(languages)
      .values({
        code: request.code,
        name: request.name,
        isDefault: request.isDefault,
        isActive: request.isActive,
      })
      .returning({ id: languages.id });

    return { id: result.id };
  }

  private async validateUniqueConstraints(request: CreateLanguageRequest) {
    const codeCheck = this.db
      .select({ id: languages.id })
      .from(languages)
      .where(eq(languages.code, request.code))
      .limit(1);

    const [existingCode] = await Promise.all([codeCheck]);

    if (existingCode.length > 0) {
      throw new ConflictException('Language code already exists');
    }
  }
}
