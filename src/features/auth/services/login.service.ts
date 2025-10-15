import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { eq } from 'drizzle-orm';
import { DatabaseService, type Database } from 'src/db/database.module';
import { users } from 'src/db/schema';
import { BaseService } from 'src/shared/types/base-service';
import { LoginRequest } from '../dto/requests/login.request';
import { LoginResponse } from '../dto/responses/login.response';
import { AuthJwtService } from './auth-jwt.service';

@Injectable()
export class LoginService implements BaseService<LoginResponse> {
  constructor(
    @Inject(DatabaseService) private readonly db: Database,
    private readonly authJwtService: AuthJwtService,
  ) {}

  async execute(loginRequest: LoginRequest) {
    const { email, password } = loginRequest;

    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { accessToken, refreshToken } =
      await this.authJwtService.createTokensAndSession(user.id);

    return new LoginResponse({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        role: user.role || 'editor',
        isActive: user.isActive || false,
      },
    });
  }
}
