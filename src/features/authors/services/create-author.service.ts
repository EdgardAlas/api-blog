import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { BaseService } from '../../../shared/types/base-service';
import { I18nTranslations } from '../../../i18n/i18n.generated';
import type { Database } from '../../../db/database.module';
import { DatabaseService } from '../../../db/database.module';
import { CreateAuthorRequest } from '../dto/requests/create-author.request';
import { IdResponse } from '../../../shared/dto/id.response';
import { authors } from '../../../db/schema/authors';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class CreateAuthorService
  implements BaseService<CreateAuthorRequest, IdResponse>
{
  constructor(
    @Inject(DatabaseService) private readonly db: Database,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async execute(request: CreateAuthorRequest): Promise<IdResponse> {
    await this.validateUniqueConstraints(request);

    const [result] = await this.db
      .insert(authors)
      .values({
        slug: request.slug,
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        avatarUrl: request.avatarUrl,
      })
      .returning({ id: authors.id });

    return { id: result.id };
  }

  private async validateUniqueConstraints(
    request: CreateAuthorRequest,
  ): Promise<void> {
    const slugCheck = this.db
      .select({ id: authors.id })
      .from(authors)
      .where(eq(authors.slug, request.slug))
      .limit(1);

    const emailCheck = this.db
      .select({ id: authors.id })
      .from(authors)
      .where(eq(authors.email, request.email))
      .limit(1);

    const nameCheck = this.db
      .select({ id: authors.id })
      .from(authors)
      .where(
        and(
          eq(authors.firstName, request.firstName),
          eq(authors.lastName, request.lastName),
        ),
      )
      .limit(1);

    const [existingSlug, existingEmail, existingName] = await Promise.all([
      slugCheck,
      emailCheck,
      nameCheck,
    ]);

    if (existingSlug.length > 0) {
      throw new ConflictException(this.i18n.t('authors.errors.slug_exists'));
    }

    if (existingEmail.length > 0) {
      throw new ConflictException(this.i18n.t('authors.errors.email_exists'));
    }

    if (existingName.length > 0) {
      throw new ConflictException(this.i18n.t('authors.errors.name_exists'));
    }
  }
}
