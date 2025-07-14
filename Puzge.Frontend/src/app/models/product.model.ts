import {Subcategory} from './subcategory.model';
import {Category} from './category.model';
import {ProductType} from '../enums/product-type.enum';

export interface Product {
  id: string;
  name: {
    en: string;
    ka: string;
  };
  description: {
    en: string;
    ka: string;
  };
  type: ProductType;
  categories: Category[];
  subcategories: Subcategory[];
  images: string[];
  price?: number;
  originalPrice?: number;
  isAvailable: boolean;
  isDiscounted?: boolean;
  createdAt: Date;
  updatedAt: Date;
  specifications?: {
    dimensions?: string;
    weight?: string;
    material?: string;
    ageRange?: string;
    playerCount?: string;
    playTime?: string;
    difficulty?: string;
  };
}
