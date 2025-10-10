import { Inject, Injectable } from '@nestjs/common';
import { eq, ilike, or } from 'drizzle-orm';
import type { Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { users } from 'src/db/schema/users';
import { BaseService } from 'src/shared/types/base-service';
import {
  createPagination,
  getPaginationParams,
} from 'src/shared/utils/pagination.utils';
import { GetUsersQuery } from 'src/features/users/dto/requests/get-users.query';
import { UserResponse } from 'src/features/users/dto/responses/user.response';
import { GetUsersResponse } from 'src/features/users/dto/responses/get-users.response';

@Injectable()
export class GetUsersService implements BaseService<GetUsersResponse> {
  constructor(@Inject(DatabaseService) private readonly db: Database) {}

  async execute(query: GetUsersQuery) {
    const { page, limit, offset } = getPaginationParams(query);

    const searchCondition = query.search
      ? or(
          ilike(users.firstName, `%${query.search}%`),
          ilike(users.lastName, `%${query.search}%`),
          ilike(users.username, `%${query.search}%`),
          ilike(users.email, `%${query.search}%`),
        )
      : undefined;

    const roleCondition = query.role ? eq(users.role, query.role) : undefined;

    const whereConditions = [searchCondition, roleCondition].filter(Boolean);
    const whereClause =
      whereConditions.length > 0
        ? whereConditions.reduce((acc, condition) => acc && condition)
        : undefined;

    const [data, total] = await Promise.all([
      this.db
        .select()
        .from(users)
        .where(whereClause)
        .limit(limit)
        .offset(offset),
      this.db.$count(users, whereClause),
    ]);

    const mappedData = data.map(
      (user) =>
        new UserResponse({
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }),
    );

    return createPagination(mappedData, total, page, limit);
  }
}
