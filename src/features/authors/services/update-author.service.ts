import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { BaseService } from '../../../shared/types/base-service';
import type { Database } from '../../../db/database.module';
import { DatabaseService } from '../../../db/database.module';
import { UpdateAuthorRequest } from '../dto/requests/update-author.request';
import { IdResponse } from '../../../shared/dto/id.response';
import { authors } from '../../../db/schema/authors';
import { eq, and, ne } from 'drizzle-orm';

interface UpdateAuthorParams {
  id: string;
  request: UpdateAuthorRequest;
}

@Injectable()
export class UpdateAuthorService
  implements BaseService<UpdateAuthorParams, IdResponse>
{
  constructor(@Inject(DatabaseService) private readonly db: Database) {}

  async execute({ id, request }: UpdateAuthorParams): Promise<IdResponse> {
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
      .where(eq(authors.id, id))
      .returning({ id: authors.id });

    return { id: result.id };
  }

  private async validateAuthorExists(id: string): Promise<void> {
    const [author] = await this.db
      .select({ id: authors.id })
      .from(authors)
      .where(eq(authors.id, id))
      .limit(1);

    if (!author) {
      throw new NotFoundException('Author not found');
    }
  }

  private async validateUniqueConstraints(
    id: string,
    request: UpdateAuthorRequest,
  ): Promise<void> {
    if (request.slug) {
      const existingSlug = await this.db
        .select({ id: authors.id })
        .from(authors)
        .where(and(ne(authors.id, id), eq(authors.slug, request.slug)))
        .limit(1);

      if (existingSlug.length > 0) {
        throw new ConflictException('An author with this slug already exists');
      }
    }

    if (request.email) {
      const existingEmail = await this.db
        .select({ id: authors.id })
        .from(authors)
        .where(and(ne(authors.id, id), eq(authors.email, request.email)))
        .limit(1);

      if (existingEmail.length > 0) {
        throw new ConflictException('An author with this email already exists');
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
        throw new ConflictException(
          'An author with this name combination already exists',
        );
      }
    }
  }
}
