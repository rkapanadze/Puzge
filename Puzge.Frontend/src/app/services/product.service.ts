// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { Subcategory } from '../models/subcategory.model';
import { ProductType } from '../enums/product-type.enum';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://your-api-url.com/api'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // Get all products with optional filtering
  getProducts(filters?: {
    type?: ProductType;
    categoryIds?: string[];
    subcategoryIds?: string[];
    search?: string;
    limit?: number;
    offset?: number;
  }): Observable<ApiResponse<Product[]>> {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.type) params.append('type', filters.type);
      if (filters.categoryIds?.length) params.append('categoryIds', filters.categoryIds.join(','));
      if (filters.subcategoryIds?.length) params.append('subcategoryIds', filters.subcategoryIds.join(','));
      if (filters.search) params.append('search', filters.search);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());
    }

    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/products?${params.toString()}`);
  }

  // Get product by ID
  getProductById(id: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/products/${id}`);
  }

  // Get all categories with their subcategories
  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/categories`);
  }

  // Get category by ID with subcategories
  getCategoryById(id: string): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/categories/${id}`);
  }

  // Get subcategories by category ID
  getSubcategoriesByCategoryId(categoryId: string): Observable<ApiResponse<Subcategory[]>> {
    return this.http.get<ApiResponse<Subcategory[]>>(`${this.apiUrl}/categories/${categoryId}/subcategories`);
  }

  // Get products by type
  getProductsByType(type: ProductType): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/products?type=${type}`);
  }

  // Get products by category
  getProductsByCategory(categoryId: string): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/products?categoryIds=${categoryId}`);
  }

  // Get products by subcategory
  getProductsBySubcategory(subcategoryId: string): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/products?subcategoryIds=${subcategoryId}`);
  }
}
