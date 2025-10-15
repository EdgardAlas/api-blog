export class LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    role: string;
    isActive: boolean;
  };

  constructor(data?: Partial<LoginResponse>) {
    Object.assign(this, data);
  }
}
