import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
import { Observable } from 'rxjs';
import {
  Rol,
  ROLES_DECORATOR_NAME,
} from 'src/features/auth/decorators/roles.decorator';
import { AuthenticatedUser } from 'src/features/auth/entities/authenticated-user.entity';
import { I18nTranslations } from 'src/i18n/i18n.generated';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>(
      ROLES_DECORATOR_NAME,
      context.getHandler(),
    );

    const request: Express.Request = context.switchToHttp().getRequest();

    const user = request.user as AuthenticatedUser;

    if (!roles) {
      return true;
    }

    if (roles.length === 0) {
      return true;
    }

    if (!user) {
      throw new BadRequestException(
        this.i18nService.t('auth.errors.access_denied'),
      );
    }

    if (user.role === Rol.ADMIN) {
      return true;
    }

    const hasRole = this.matchRoles(roles, user.role);

    if (!hasRole) {
      throw new BadRequestException(
        this.i18nService.t('auth.errors.insufficient_permissions'),
      );
    }

    return hasRole;
  }

  matchRoles(roles: string[], userRole: string) {
    return roles.includes(userRole);
  }
}
