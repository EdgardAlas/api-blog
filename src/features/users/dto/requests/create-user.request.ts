import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserRequest {
  @IsNotEmpty({
    message: 'Email is required',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @Length(1, 255, {
    message: 'Email must be between 1 and 255 characters',
  })
  email: string;

  @IsNotEmpty({
    message: 'Password is required',
  })
  @IsString({
    message: 'Password must be a string',
  })
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  password: string;

  @IsOptional()
  @IsString({
    message: 'First name must be a string',
  })
  @Length(1, 100, {
    message: 'First name must be between 1 and 100 characters',
  })
  firstName?: string;

  @IsOptional()
  @IsString({
    message: 'Last name must be a string',
  })
  @Length(1, 100, {
    message: 'Last name must be between 1 and 100 characters',
  })
  lastName?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar URL must be a valid URL' })
  avatarUrl?: string;

  @IsOptional()
  @IsEnum(['admin', 'editor'], {
    message: 'Role must be either admin or editor',
  })
  role?: 'admin' | 'editor';

  @IsOptional()
  @IsBoolean({
    message: 'Active status must be a boolean',
  })
  isActive?: boolean;
}
