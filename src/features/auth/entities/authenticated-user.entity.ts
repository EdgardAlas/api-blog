import { Roles } from 'src/features/auth/decorators/roles.decorator';

export class AuthenticatedUser {
  id: string;
  role: Roles;
  accessTokenJti: string;
  refreshTokenJti: string;

  constructor(data?: Partial<AuthenticatedUser>) {
    Object.assign(this, data);
  }
}
