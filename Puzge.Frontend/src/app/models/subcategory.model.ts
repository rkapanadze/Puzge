// src/app/models/subcategory.model.ts
export interface Subcategory {
  id: string;
  name: {
    en: string;
    ka: string;
  };
  description: {
    en: string;
    ka: string;
  };
  categoryId: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
