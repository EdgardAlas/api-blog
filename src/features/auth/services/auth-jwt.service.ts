import {
  Injectable,
  Inject,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { type Database } from 'src/db/database.module';
import { DatabaseService } from 'src/db/database.module';
import { authSessions } from 'src/db/schema';
import { EnvsService } from 'src/env/services/envs.service';
import { eq } from 'drizzle-orm';

interface JwtPayloadContainsJti {
  sub: string;
  jti: string;
}

@Injectable()
export class AuthJwtService {
  private readonly logger = new Logger(AuthJwtService.name);
  private readonly jwtSecret: string;
  private readonly jwtRefreshSecret: string;
  private readonly jwtExpiresIn: number;
  private readonly jwtRefreshExpiresIn: number;

  constructor(
    private readonly jwt: JwtService,
    private readonly envs: EnvsService,
    @Inject(DatabaseService) private readonly db: Database,
  ) {
    this.jwtSecret = this.envs.get('JWT_AUTH_SECRET');
    this.jwtRefreshSecret = this.envs.get('JWT_REFRESH_SECRET');
    this.jwtExpiresIn = this.envs.get('JWT_AUTH_EXPIRES_IN');
    this.jwtRefreshExpiresIn = this.envs.get('JWT_REFRESH_EXPIRES_IN');
  }

  async createTokensAndSession(userId: string) {
    const accessTokenJti = randomUUID();
    const refreshTokenJti = randomUUID();
    const expiresAt = new Date(Date.now() + this.jwtRefreshExpiresIn * 1000);

    await this.db.insert(authSessions).values({
      userId,
      accessTokenJti,
      refreshTokenJti,
      expiresAt,
    });

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        { sub: userId, jti: accessTokenJti },
        {
          secret: this.jwtSecret,
          expiresIn: this.jwtExpiresIn,
        },
      ),
      this.jwt.signAsync(
        { sub: userId, jti: refreshTokenJti },
        {
          secret: this.jwtRefreshSecret,
          expiresIn: this.jwtRefreshExpiresIn,
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string) {
    try {
      const payload = this.jwt.verify<JwtPayloadContainsJti>(token, {
        secret: this.jwtSecret,
      });

      if (!payload.jti) {
        throw new UnauthorizedException('Invalid token');
      }

      const [session] = await this.db
        .select()
        .from(authSessions)
        .where(eq(authSessions.accessTokenJti, payload.jti))
        .limit(1);
      if (!session) {
        throw new UnauthorizedException('Invalid token');
      }

      return payload;
    } catch (err) {
      this.logger.warn('verifyAccessToken failed', err);
      throw new UnauthorizedException('Invalid token');
    }
  }

  async verifyRefreshToken(token: string) {
    try {
      const payload = this.jwt.verify<{ sub: string; jti: string }>(token, {
        secret: this.jwtRefreshSecret,
      });

      if (!payload.jti) {
        throw new UnauthorizedException('Invalid token');
      }

      const [session] = await this.db
        .select()
        .from(authSessions)
        .where(eq(authSessions.refreshTokenJti, payload.jti))
        .limit(1);
      if (!session) {
        throw new UnauthorizedException('Invalid token');
      }

      return { payload, session };
    } catch (err) {
      this.logger.warn('verifyRefreshToken failed', err);
      throw new UnauthorizedException('Invalid token');
    }
  }

  async rotateSessionTokens(sessionId: string) {
    const [session] = await this.db
      .select()
      .from(authSessions)
      .where(eq(authSessions.id, sessionId))
      .limit(1);
    if (!session) throw new UnauthorizedException('Invalid token');

    const newAccessTokenJti = randomUUID();
    const newRefreshTokenJti = randomUUID();

    await this.db
      .update(authSessions)
      .set({
        accessTokenJti: newAccessTokenJti,
        refreshTokenJti: newRefreshTokenJti,
      })
      .where(eq(authSessions.id, sessionId));

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        { sub: session.userId, jti: newAccessTokenJti },
        {
          secret: this.jwtSecret,
          expiresIn: this.jwtExpiresIn,
        },
      ),
      this.jwt.signAsync(
        { sub: session.userId, jti: newRefreshTokenJti },
        {
          secret: this.jwtRefreshSecret,
          expiresIn: this.jwtRefreshExpiresIn,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      sessionId,
    };
  }
}
