import { Inject, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { and, eq } from 'drizzle-orm';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { type Database, DatabaseService } from 'src/db/database.module';
import { authSessions, users } from 'src/db/schema';
import { EnvsService } from 'src/env/services/envs.service';
import { Roles } from 'src/features/auth/decorators/roles.decorator';
import { AuthenticatedUser } from 'src/features/auth/entities/authenticated-user.entity';
import { I18nTranslations } from 'src/i18n/i18n.generated';

interface JwtPayload {
  sub: string;
  jti: string;
}

export class AuthJwtStrategy extends PassportStrategy(Strategy, 'auth-jwt') {
  private readonly logger = new Logger(AuthJwtStrategy.name);

  constructor(
    private readonly envService: EnvsService,
    @Inject(DatabaseService) private readonly db: Database,
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envService.get('JWT_REFRESH_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const [user] = await this.db
      .select({
        id: users.id,
        accessTokenJti: authSessions.accessTokenJti,
        refreshTokenJti: authSessions.refreshTokenJti,
        isActive: users.isActive,
        role: users.role,
      })
      .from(users)
      .innerJoin(authSessions, eq(authSessions.userId, users.id))
      .where(
        and(
          eq(users.id, payload.sub),
          eq(authSessions.id, payload.jti),
          eq(authSessions.isRevoked, false),
        ),
      )
      .limit(1);

    if (!user) {
      this.logger.warn(`Invalid JWT token - user not found or session revoked`);
      throw new UnauthorizedException(
        this.i18nService.t('auth.errors.invalid_token'),
      );
    }

    if (!user.isActive) {
      this.logger.warn(`User ${user.id} is inactive`);
      throw new UnauthorizedException(
        this.i18nService.t('auth.errors.inactive_user'),
      );
    }

    return new AuthenticatedUser({
      id: user.id,
      role: user.role as Roles,
      accessTokenJti: user.accessTokenJti,
      refreshTokenJti: user.refreshTokenJti,
    });
  }
}
