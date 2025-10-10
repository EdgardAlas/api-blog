import { PaginatedResponse } from 'src/shared/dto/paginated.response';
import { UserResponse } from './user.response';

export class GetUsersResponse extends PaginatedResponse<UserResponse> {}
