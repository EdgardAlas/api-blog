import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { BaseService } from 'src/shared/types/base-service';
import { I18nTranslations } from 'src/i18n/i18n.generated';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { CreateUserRequest } from 'src/features/users/dto/requests/create-user.request';
import { IdResponse } from 'src/shared/dto/id.response';
import { users } from 'src/db/schema/users';
import { eq, or } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserService implements BaseService<IdResponse> {
  constructor(
    @Inject(DatabaseService) private readonly db: Database,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async execute(request: CreateUserRequest) {
    await this.validateUniqueConstraints(request);

    const passwordHash = await bcrypt.hash(request.password, 12);

    const [result] = await this.db
      .insert(users)
      .values({
        email: request.email,
        username: request.username,
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
      .select({ id: users.id, email: users.email, username: users.username })
      .from(users)
      .where(
        or(
          eq(users.email, request.email),
          eq(users.username, request.username),
        ),
      )
      .limit(1);

    if (!existingUser) return;

    if (existingUser.email === request.email) {
      throw new ConflictException(this.i18n.t('users.errors.email_exists'));
    }

    if (existingUser.username === request.username) {
      throw new ConflictException(this.i18n.t('users.errors.username_exists'));
    }
  }
}
