export interface Author {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  email: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
