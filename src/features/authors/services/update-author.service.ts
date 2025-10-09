import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { BaseService } from 'src/shared/types/base-service';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { UpdateAuthorRequest } from 'src/features/authors/dto/requests/update-author.request';
import { IdResponse } from 'src/shared/dto/id.response';
import { authors } from 'src/db/schema/authors';
import { eq, and, ne } from 'drizzle-orm';
import { I18nTranslations } from 'src/i18n/i18n.generated';

interface UpdateAuthorParams {
  id: string;
  request: UpdateAuthorRequest;
}

@Injectable()
export class UpdateAuthorService implements BaseService<IdResponse> {
  constructor(
    @Inject(DatabaseService) private readonly db: Database,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async execute({ id, request }: UpdateAuthorParams) {
    await this.validateAuthorExists(id);
    await this.validateUniqueConstraints(id, request);

    const [result] = await this.db
      .update(authors)
      .set({
        avatarUrl: request.avatarUrl,
        email: request.email,
        firstName: request.firstName,
        lastName: request.lastName,
        slug: request.slug,
      })
      .returning({ id: authors.id });

    if (!result) {
      throw new NotFoundException(this.i18n.t('authors.errors.not_found'));
    }

    return { id: result.id };
  }

  private async validateAuthorExists(id: string) {
    const [author] = await this.db
      .select({ id: authors.id })
      .from(authors)
      .where(eq(authors.id, id))
      .limit(1);

    if (!author) {
      throw new NotFoundException(this.i18n.t('authors.errors.not_found'));
    }
  }

  private async validateUniqueConstraints(
    id: string,
    request: UpdateAuthorRequest,
  ) {
    if (request.slug) {
      const existingSlug = await this.db
        .select({ id: authors.id })
        .from(authors)
        .where(and(ne(authors.id, id), eq(authors.slug, request.slug)))
        .limit(1);

      if (existingSlug.length > 0) {
        throw new ConflictException(this.i18n.t('authors.errors.slug_exists'));
      }
    }

    if (request.email) {
      const existingEmail = await this.db
        .select({ id: authors.id })
        .from(authors)
        .where(and(ne(authors.id, id), eq(authors.email, request.email)))
        .limit(1);

      if (existingEmail.length > 0) {
        throw new ConflictException(this.i18n.t('authors.errors.email_exists'));
      }
    }

    if (request.firstName || request.lastName) {
      const [currentAuthor] = await this.db
        .select({ firstName: authors.firstName, lastName: authors.lastName })
        .from(authors)
        .where(eq(authors.id, id))
        .limit(1);

      const finalFirstName = request.firstName ?? currentAuthor.firstName;
      const finalLastName = request.lastName ?? currentAuthor.lastName;

      const existingName = await this.db
        .select({ id: authors.id })
        .from(authors)
        .where(
          and(
            ne(authors.id, id),
            eq(authors.firstName, finalFirstName),
            eq(authors.lastName, finalLastName),
          ),
        )
        .limit(1);

      if (existingName.length > 0) {
        throw new ConflictException(this.i18n.t('authors.errors.name_exists'));
      }
    }
  }
}
