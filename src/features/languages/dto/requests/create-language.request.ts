import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateLanguageRequest {
  @IsNotEmpty({
    message: 'Language code is required',
  })
  @IsString({
    message: 'Language code must be a string',
  })
  @Length(2, 5, {
    message: 'Language code must be between 2 and 5 characters',
  })
  code: string;

  @IsNotEmpty({
    message: 'Language name is required',
  })
  @IsString({
    message: 'Language name must be a string',
  })
  @Length(1, 100, {
    message: 'Language name must be between 1 and 100 characters',
  })
  name: string;

  @IsOptional()
  @IsBoolean({
    message: 'Is default must be a boolean',
  })
  isDefault?: boolean;

  @IsOptional()
  @IsBoolean({
    message: 'Is active must be a boolean',
  })
  isActive?: boolean;
}
