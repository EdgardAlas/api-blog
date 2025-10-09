export class TagTranslationResponse {
  id: string;
  languageId: string;
  name: string;
  slug: string;
  createdAt: Date | null;

  constructor(data?: Partial<TagTranslationResponse>) {
    Object.assign(this, data);
  }
}

export class TagResponse {
  id: string;
  color: string | null;
  isActive: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  postCount: number;
  translations: TagTranslationResponse[];

  constructor(data?: Partial<TagResponse>) {
    Object.assign(this, data);
  }
}
