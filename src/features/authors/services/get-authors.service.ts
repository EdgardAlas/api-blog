import { Inject, Injectable } from '@nestjs/common';
import { ilike, or } from 'drizzle-orm';
import type { Database } from '../../../db/database.module';
import { DatabaseService } from '../../../db/database.module';
import { authors } from '../../../db/schema/authors';
import { BaseService } from '../../../shared/types/base-service';
import {
  createPagination,
  getPaginationParams,
} from '../../../shared/utils/pagination.utils';
import { GetAuthorsQuery } from '../dto/requests/get-authors.query';
import { AuthorResponse } from '../dto/responses/author.response';
import { GetAuthorsResponse } from '../dto/responses/get-authors.response';

@Injectable()
export class GetAuthorsService
  implements BaseService<GetAuthorsQuery, GetAuthorsResponse>
{
  constructor(@Inject(DatabaseService) private readonly db: Database) {}

  async execute(query: GetAuthorsQuery): Promise<GetAuthorsResponse> {
    const { page, limit, offset } = getPaginationParams(query);

    const searchCondition = query.search
      ? or(
          ilike(authors.firstName, `%${query.search}%`),
          ilike(authors.lastName, `%${query.search}%`),
          ilike(authors.slug, `%${query.search}%`),
        )
      : undefined;

    const [data, total] = await Promise.all([
      this.db
        .select()
        .from(authors)
        .where(searchCondition)
        .limit(limit)
        .offset(offset),
      this.db.$count(authors, searchCondition),
    ]);

    const mappedData = data.map(
      (author) =>
        new AuthorResponse({
          id: author.id,
          slug: author.slug,
          firstName: author.firstName,
          lastName: author.lastName,
          email: author.email,
          avatarUrl: author.avatarUrl,
          isActive: author.isActive,
          createdAt: author.createdAt,
          updatedAt: author.updatedAt,
        }),
    );

    return createPagination(mappedData, total, page, limit);
  }
}
