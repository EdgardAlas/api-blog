export class AuthorResponse {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  email: string | null;
  avatarUrl: string | null;
  isActive: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;

  constructor(data?: Partial<AuthorResponse>) {
    Object.assign(this, data);
  }
}
