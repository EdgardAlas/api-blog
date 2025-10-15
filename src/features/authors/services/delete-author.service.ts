import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/shared/types/base-service';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { IdResponse } from 'src/shared/dto/id.response';
import { authors } from 'src/db/schema/authors';
import { eq } from 'drizzle-orm';

@Injectable()
export class DeleteAuthorService implements BaseService<IdResponse> {
  constructor(@Inject(DatabaseService) private readonly db: Database) {}

  async execute(id: string) {
    const [result] = await this.db
      .delete(authors)
      .where(eq(authors.id, id))
      .returning({ id: authors.id });

    if (!result) {
      throw new NotFoundException('Author not found');
    }

    return { id: result.id };
  }
}
