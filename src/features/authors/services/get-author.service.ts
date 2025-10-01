import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { BaseService } from 'src/shared/types/base-service';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { AuthorResponse } from '../dto/responses/author.response';
import { authors } from 'src/db/schema/authors';
import { eq } from 'drizzle-orm';
import { I18nTranslations } from 'src/i18n/i18n.generated';

@Injectable()
export class GetAuthorService implements BaseService<string, AuthorResponse> {
  constructor(
    @Inject(DatabaseService) private readonly db: Database,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async execute(id: string) {
    const [author] = await this.db
      .select()
      .from(authors)
      .where(eq(authors.id, id));

    if (!author) {
      throw new NotFoundException(this.i18n.t('authors.errors.not_found'));
    }

    return new AuthorResponse({
      id: author.id,
      slug: author.slug,
      firstName: author.firstName,
      lastName: author.lastName,
      email: author.email,
      avatarUrl: author.avatarUrl,
      isActive: author.isActive,
      createdAt: author.createdAt,
      updatedAt: author.updatedAt,
    });
  }
}
