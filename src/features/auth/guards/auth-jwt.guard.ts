import { Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { I18nContext } from 'nestjs-i18n';

export class AuthJwtGuard extends AuthGuard('auth-jwt') {
  private readonly logger = new Logger(AuthJwtGuard.name);

  handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
    const i18nService = I18nContext.current();
    if (err || !user) {
      this.logger.warn(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        `⚠️ JWT validation failed: ${JSON.stringify({ info, err }) || 'Unknown error'}`,
      );
      throw (
        err ||
        new UnauthorizedException(i18nService?.t('auth.errors.unauthorized'))
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user;
  }
}
