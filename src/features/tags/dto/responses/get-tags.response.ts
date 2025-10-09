import { PaginatedResponse } from 'src/shared/dto/paginated.response';
import { TagResponse } from './tag.response';

export class GetTagsResponse extends PaginatedResponse<TagResponse> {}
