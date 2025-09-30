import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthorRequest } from './create-author.request';

export class UpdateAuthorRequest extends PartialType(CreateAuthorRequest) {}
