export class PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(data?: Partial<PaginatedResponse<T>>) {
    Object.assign(this, data);
  }
}
