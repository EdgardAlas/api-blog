import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { users } from 'src/db/schema/users';
import { BaseService } from 'src/shared/types/base-service';
import { UserResponse } from 'src/features/users/dto/responses/user.response';

@Injectable()
export class GetUserService implements BaseService<UserResponse> {
  constructor(@Inject(DatabaseService) private readonly db: Database) {}

  async execute(id: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserResponse({
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
