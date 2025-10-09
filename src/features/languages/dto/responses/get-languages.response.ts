import { LanguageResponse } from 'src/features/languages/dto/responses/language.response';
import { PaginatedResponse } from 'src/shared/dto/paginated.response';

export class GetLanguagesResponse extends PaginatedResponse<LanguageResponse> {}
