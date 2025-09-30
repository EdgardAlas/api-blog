export interface PaginationParams {
  page?: number;
  limit?: number;
}

import { PaginatedResponse } from '../dto/paginated.response';

export type PaginationResult<T> = PaginatedResponse<T>;

export function getPaginationParams(params: PaginationParams) {
  const page = params.page || 1;
  const limit = Math.min(params.limit || 10, 100);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

export function createPagination<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResponse<T> {
  return new PaginatedResponse<T>({
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
