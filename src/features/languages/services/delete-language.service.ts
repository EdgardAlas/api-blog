import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/shared/types/base-service';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { IdResponse } from 'src/shared/dto/id.response';
import { languages } from 'src/db/schema/languages';
import { eq } from 'drizzle-orm';

@Injectable()
export class DeleteLanguageService implements BaseService<IdResponse> {
  constructor(@Inject(DatabaseService) private readonly db: Database) {}

  async execute(id: string) {
    const [result] = await this.db
      .delete(languages)
      .where(eq(languages.id, id))
      .returning({ id: languages.id });

    if (!result) {
      throw new NotFoundException('Language not found');
    }

    return { id: result.id };
  }
}
