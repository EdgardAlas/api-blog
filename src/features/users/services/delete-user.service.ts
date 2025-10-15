import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/shared/types/base-service';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { IdResponse } from 'src/shared/dto/id.response';
import { users } from 'src/db/schema/users';
import { eq } from 'drizzle-orm';

@Injectable()
export class DeleteUserService implements BaseService<IdResponse> {
  constructor(@Inject(DatabaseService) private readonly db: Database) {}

  async execute(id: string) {
    const [result] = await this.db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });

    if (!result) {
      throw new NotFoundException('User not found');
    }

    return { id: result.id };
  }
}
