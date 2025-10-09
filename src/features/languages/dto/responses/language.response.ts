export class LanguageResponse {
  id: string;
  code: string;
  name: string;
  isDefault: boolean | null;
  isActive: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  postsCount: number;

  constructor(data?: Partial<LanguageResponse>) {
    Object.assign(this, data);
  }
}
