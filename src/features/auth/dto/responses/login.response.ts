export class LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
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
