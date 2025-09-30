import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../../shared/types/base-service';
import type { Database } from '../../../db/database.module';
import { DatabaseService } from '../../../db/database.module';
import { IdResponse } from '../../../shared/dto/id.response';
import { authors } from '../../../db/schema/authors';
import { eq } from 'drizzle-orm';

@Injectable()
export class DeleteAuthorService implements BaseService<string, IdResponse> {
  constructor(@Inject(DatabaseService) private readonly db: Database) {}

  async execute(id: string): Promise<IdResponse> {
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
