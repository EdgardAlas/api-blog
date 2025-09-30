import { AuthorResponse } from './author.response';
import { PaginatedResponse } from '../../../../shared/dto/paginated.response';

export class GetAuthorsResponse extends PaginatedResponse<AuthorResponse> {}
