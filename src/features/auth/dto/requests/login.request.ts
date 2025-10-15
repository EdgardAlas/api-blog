import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginRequest {
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
  @Length(8, 100, {
    message: 'Password must be between 8 and 100 characters',
  })
  password: string;
}
