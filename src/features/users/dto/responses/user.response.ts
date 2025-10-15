export class UserResponse {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  role: string | null;
  isActive: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;

  constructor(data?: Partial<UserResponse>) {
    Object.assign(this, data);
  }
}
