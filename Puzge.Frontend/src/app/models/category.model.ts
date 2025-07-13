// src/app/models/category.model.ts
import { Subcategory } from './subcategory.model';

export interface Category {
  id: string;
  name: {
    en: string;
    ka: string;
  };
  description: {
    en: string;
    ka: string;
  };
  image?: string;
  subcategories: Subcategory[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
