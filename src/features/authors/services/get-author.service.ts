import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/shared/types/base-service';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { AuthorResponse } from '../dto/responses/author.response';
import { authors } from 'src/db/schema/authors';
import { eq } from 'drizzle-orm';

@Injectable()
export class GetAuthorService implements BaseService<AuthorResponse> {
  constructor(@Inject(DatabaseService) private readonly db: Database) {}

  async execute(id: string) {
    const [author] = await this.db
      .select()
      .from(authors)
      .where(eq(authors.id, id));

    if (!author) {
      throw new NotFoundException('Author not found');
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
