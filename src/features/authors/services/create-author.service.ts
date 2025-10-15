import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { BaseService } from 'src/shared/types/base-service';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { CreateAuthorRequest } from 'src/features/authors/dto/requests/create-author.request';
import { IdResponse } from 'src/shared/dto/id.response';
import { authors } from 'src/db/schema/authors';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class CreateAuthorService implements BaseService<IdResponse> {
  constructor(@Inject(DatabaseService) private readonly db: Database) {}

  async execute(request: CreateAuthorRequest) {
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

  private async validateUniqueConstraints(request: CreateAuthorRequest) {
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
      throw new ConflictException('An author with this slug already exists');
    }

    if (existingEmail.length > 0) {
      throw new ConflictException('An author with this email already exists');
    }

    if (existingName.length > 0) {
      throw new ConflictException('An author with this name already exists');
    }
  }
}
