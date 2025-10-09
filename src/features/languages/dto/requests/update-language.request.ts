import { PartialType } from '@nestjs/mapped-types';
import { CreateLanguageRequest } from './create-language.request';

export class UpdateLanguageRequest extends PartialType(CreateLanguageRequest) {}
