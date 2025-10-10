import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { BaseService } from 'src/shared/types/base-service';
import { I18nTranslations } from 'src/i18n/i18n.generated';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { UpdateUserRequest } from 'src/features/users/dto/requests/update-user.request';
import { IdResponse } from 'src/shared/dto/id.response';
import { users } from 'src/db/schema/users';
import { eq, and, ne } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

interface UpdateUserParams {
  id: string;
  request: UpdateUserRequest;
}

@Injectable()
export class UpdateUserService implements BaseService<IdResponse> {
  constructor(
    @Inject(DatabaseService) private readonly db: Database,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async execute({ id, request }: UpdateUserParams) {
    await this.validateUserExists(id);
    await this.validateUniqueConstraints(id, request);

    const password = request.password
      ? await bcrypt.hash(request.password, 12)
      : undefined;

    await this.db
      .update(users)
      .set({
        email: request.email,
        username: request.username,
        passwordHash: password,
        firstName: request.firstName,
        lastName: request.lastName,
        avatarUrl: request.avatarUrl,
        role: request.role,
        isActive: request.isActive,
      })
      .where(eq(users.id, id));

    return { id };
  }

  private async validateUserExists(id: string) {
    const [user] = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new NotFoundException(this.i18n.t('users.errors.not_found'));
    }
  }

  private async validateUniqueConstraints(
    userId: string,
    request: UpdateUserRequest,
  ) {
    if (request.email) {
      const existingEmail = await this.db
        .select({ id: users.id })
        .from(users)
        .where(and(ne(users.id, userId), eq(users.email, request.email)))
        .limit(1);

      if (existingEmail.length > 0) {
        throw new ConflictException(this.i18n.t('users.errors.email_exists'));
      }
    }

    if (request.username) {
      const existingUsername = await this.db
        .select({ id: users.id })
        .from(users)
        .where(and(ne(users.id, userId), eq(users.username, request.username)))
        .limit(1);

      if (existingUsername.length > 0) {
        throw new ConflictException(
          this.i18n.t('users.errors.username_exists'),
        );
      }
    }
  }
}
