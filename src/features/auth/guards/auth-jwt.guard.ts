import { Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class AuthJwtGuard extends AuthGuard('auth-jwt') {
  private readonly logger = new Logger(AuthJwtGuard.name);

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      this.logger.warn(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        `⚠️ JWT validation failed: ${JSON.stringify({ info, err }) || 'Unknown error'}`,
      );
      throw (
        err ||
        new UnauthorizedException('Invalid or missing authentication token')
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user;
  }
}
