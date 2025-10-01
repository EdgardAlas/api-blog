import { AuthorResponse } from 'src/features/authors/dto/responses/author.response';
import { PaginatedResponse } from 'src/shared/dto/paginated.response';

export class GetAuthorsResponse extends PaginatedResponse<AuthorResponse> {}
