import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import {
  Rol,
  ROLES_DECORATOR_NAME,
} from 'src/features/auth/decorators/roles.decorator';
import { AuthenticatedUser } from 'src/features/auth/entities/authenticated-user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

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
      throw new BadRequestException('Access denied');
    }

    if (user.role === Rol.ADMIN) {
      return true;
    }

    const hasRole = this.matchRoles(roles, user.role);

    if (!hasRole) {
      throw new BadRequestException('Insufficient permissions');
    }

    return hasRole;
  }

  matchRoles(roles: string[], userRole: string) {
    return roles.includes(userRole);
  }
}
