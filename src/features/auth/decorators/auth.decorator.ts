import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from 'src/features/auth/decorators/roles.decorator';
import { AuthJwtGuard } from 'src/features/auth/guards/auth-jwt.guard';
import { RolesGuard } from 'src/features/auth/guards/roles.guard';

export const Auth = (...roles: Roles[]) =>
  applyDecorators(Roles(...roles), UseGuards(AuthJwtGuard, RolesGuard));
