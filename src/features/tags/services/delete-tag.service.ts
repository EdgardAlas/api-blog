import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/shared/types/base-service';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { IdResponse } from 'src/shared/dto/id.response';
import { tags } from 'src/db/schema/tags';
import { eq } from 'drizzle-orm';

@Injectable()
export class DeleteTagService implements BaseService<IdResponse> {
  constructor(@Inject(DatabaseService) private readonly db: Database) {}

  async execute(id: string) {
    const [result] = await this.db
      .delete(tags)
      .where(eq(tags.id, id))
      .returning({ id: tags.id });

    if (!result) {
      throw new NotFoundException('Tag not found');
    }

    return { id: result.id };
  }
}
