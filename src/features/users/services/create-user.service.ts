import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { BaseService } from 'src/shared/types/base-service';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { CreateUserRequest } from 'src/features/users/dto/requests/create-user.request';
import { IdResponse } from 'src/shared/dto/id.response';
import { users } from 'src/db/schema/users';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserService implements BaseService<IdResponse> {
  constructor(@Inject(DatabaseService) private readonly db: Database) {}

  async execute(request: CreateUserRequest) {
    await this.validateUniqueConstraints(request);

    const passwordHash = await bcrypt.hash(request.password, 12);

    const [result] = await this.db
      .insert(users)
      .values({
        email: request.email,
        passwordHash,
        firstName: request.firstName,
        lastName: request.lastName,
        avatarUrl: request.avatarUrl,
        role: request.role,
        isActive: request.isActive,
      })
      .returning({ id: users.id });

    return { id: result.id };
  }

  private async validateUniqueConstraints(request: CreateUserRequest) {
    const [existingUser] = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, request.email))
      .limit(1);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
  }
}
