import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../../shared/types/base-service';
import type { Database } from '../../../db/database.module';
import { DatabaseService } from '../../../db/database.module';
import { AuthorResponse } from '../dto/responses/author.response';
import { authors } from '../../../db/schema/authors';
import { eq } from 'drizzle-orm';

@Injectable()
export class GetAuthorService implements BaseService<string, AuthorResponse> {
  constructor(@Inject(DatabaseService) private readonly db: Database) {}

  async execute(id: string): Promise<AuthorResponse> {
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
