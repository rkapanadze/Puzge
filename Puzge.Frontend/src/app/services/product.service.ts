// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { Subcategory } from '../models/subcategory.model';
import { ProductType } from '../enums/product-type.enum';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5223'; // Replace with your actual API URL
  private useMockData = true; // Set to false when backend is ready

  constructor(private http: HttpClient) {}

  // Mock data for development
  private mockCategories: Category[] = [
    {
      id: '1',
      name: { en: 'Puzzles', ka: 'პაზლები' },
      description: { en: 'Brain teasers and logic puzzles', ka: 'გონებრივი თამაშები და ლოგიკური პაზლები' },
      image: '/assets/images/puzzles-category.svg',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      subcategories: [
        { id: '1-1', name: { en: 'Jigsaw Puzzles', ka: 'ჯიგსო პაზლები' }, description: { en: 'Traditional jigsaw puzzles', ka: 'ტრადიციული ჯიგსო პაზლები' }, categoryId: '1', isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { id: '1-2', name: { en: 'Logic Puzzles', ka: 'ლოგიკური პაზლები' }, description: { en: 'Logic and brain teasers', ka: 'ლოგიკური და გონებრივი თამაშები' }, categoryId: '1', isActive: true, createdAt: new Date(), updatedAt: new Date() }
      ]
    },
    {
      id: '2',
      name: { en: 'Board Games', ka: 'სამაგიდო თამაშები' },
      description: { en: 'Classic and modern board games', ka: 'კლასიკური და თანამედროვე სამაგიდო თამაშები' },
      image: '/assets/images/board-games-category.svg',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      subcategories: [
        { id: '2-1', name: { en: 'Strategy Games', ka: 'სტრატეგიული თამაშები' }, description: { en: 'Strategic thinking games', ka: 'სტრატეგიული აზროვნების თამაშები' }, categoryId: '2', isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { id: '2-2', name: { en: 'Family Games', ka: 'ოჯახური თამაშები' }, description: { en: 'Games for the whole family', ka: 'თამაშები მთელი ოჯახისთვის' }, categoryId: '2', isActive: true, createdAt: new Date(), updatedAt: new Date() }
      ]
    },
    {
      id: '3',
      name: { en: 'Card Games', ka: 'ბანქოს თამაშები' },
      description: { en: 'Traditional and modern card games', ka: 'ტრადიციული და თანამედროვე ბანქოს თამაშები' },
      image: '/assets/images/card-games-category.svg',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      subcategories: [
        { id: '3-1', name: { en: 'Collectible Card Games', ka: 'კოლექციონირებადი ბანქოს თამაშები' }, description: { en: 'CCGs and trading card games', ka: 'კოლექციონირებადი და სავაჭრო ბანქოს თამაშები' }, categoryId: '3', isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { id: '3-2', name: { en: 'Traditional Cards', ka: 'ტრადიციული ბანქო' }, description: { en: 'Classic card games', ka: 'კლასიკური ბანქოს თამაშები' }, categoryId: '3', isActive: true, createdAt: new Date(), updatedAt: new Date() }
      ]
    }
  ];

  private mockProducts: Product[] = [
    {
      id: '1',
      name: { en: '1000 Piece Jigsaw Puzzle', ka: '1000 ცალი ჯიგსო პაზლი' },
      description: { en: 'Beautiful landscape puzzle', ka: 'შესანიშნავი ლანდშაფტის პაზლი' },
      type: ProductType.PUZZLE,
      categories: [this.mockCategories[0]],
      subcategories: [this.mockCategories[0].subcategories[0]],
      images: ['/assets/images/puzzle1.jpg'],
      price: 45.99,
      originalPrice: 59.99,
      isDiscounted: true,
      specifications: {
        ageRange: '12+',
        playerCount: '1-4',
        playTime: '2-4 hours'
      },
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: { en: 'Chess Set', ka: 'ჭადრაკის კომპლექტი' },
      description: { en: 'Classic wooden chess set', ka: 'კლასიკური ხის ჭადრაკის კომპლექტი' },
      type: ProductType.BOARDGAME,
      categories: [this.mockCategories[1]],
      subcategories: [this.mockCategories[1].subcategories[0]],
      images: ['/assets/images/chess.jpg'],
      price: 89.99,
      specifications: {
        ageRange: '8+',
        playerCount: '2',
        playTime: '30-60 min'
      },
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: { en: 'Poker Deck', ka: 'პოკერის კოლოდა' },
      description: { en: 'Standard 52-card poker deck', ka: 'სტანდარტული 52 ბანქოს პოკერის კოლოდა' },
      type: ProductType.CARDGAME,
      categories: [this.mockCategories[2]],
      subcategories: [this.mockCategories[2].subcategories[1]],
      images: ['/assets/images/poker.jpg'],
      price: 12.99,
      originalPrice: 19.99,
      isDiscounted: true,
      specifications: {
        ageRange: '18+',
        playerCount: '2-10',
        playTime: '30-120 min'
      },
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      name: { en: '500 Piece Puzzle', ka: '500 ცალი პაზლი' },
      description: { en: 'Medium difficulty puzzle', ka: 'საშუალო სირთულის პაზლი' },
      type: ProductType.PUZZLE,
      categories: [this.mockCategories[0]],
      subcategories: [this.mockCategories[0].subcategories[0]],
      images: ['/assets/images/puzzle2.jpg'],
      price: 29.99,
      specifications: {
        ageRange: '8+',
        playerCount: '1-2',
        playTime: '1-2 hours'
      },
      isAvailable: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '5',
      name: { en: 'Monopoly Classic', ka: 'მონოპოლია კლასიკური' },
      description: { en: 'The classic board game', ka: 'კლასიკური სამაგიდო თამაში' },
      type: ProductType.BOARDGAME,
      categories: [this.mockCategories[1]],
      subcategories: [this.mockCategories[1].subcategories[1]],
      images: ['/assets/images/monopoly.jpg'],
      price: 34.99,
      originalPrice: 44.99,
      isDiscounted: true,
      specifications: {
        ageRange: '8+',
        playerCount: '2-8',
        playTime: '60-180 min'
      },
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Get all products with optional filtering
  getProducts(filters?: {
    type?: ProductType;
    categoryIds?: string[];
    subcategoryIds?: string[];
    search?: string;
    limit?: number;
    offset?: number;
  }): Observable<ApiResponse<Product[]>> {
    if (this.useMockData) {
      let filteredProducts = [...this.mockProducts];
      
      if (filters) {
        if (filters.type) {
          filteredProducts = filteredProducts.filter(p => p.type === filters.type);
        }
        if (filters.categoryIds?.length) {
          filteredProducts = filteredProducts.filter(p => 
            p.categories.some(cat => filters.categoryIds!.includes(cat.id))
          );
        }
        if (filters.subcategoryIds?.length) {
          filteredProducts = filteredProducts.filter(p => 
            p.subcategories.some(sub => filters.subcategoryIds!.includes(sub.id))
          );
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredProducts = filteredProducts.filter(p => 
            p.name.en.toLowerCase().includes(searchLower) ||
            p.name.ka.toLowerCase().includes(searchLower) ||
            p.description.en.toLowerCase().includes(searchLower) ||
            p.description.ka.toLowerCase().includes(searchLower)
          );
        }
      }
      
      return of({ success: true, data: filteredProducts, message: { en: 'Mock data', ka: 'მოკი მონაცემები' } });
    }

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
    if (this.useMockData) {
      const product = this.mockProducts.find(p => p.id === id);
      return of({ 
        success: !!product, 
        data: product!, 
        message: product ? { en: 'Mock data', ka: 'მოკი მონაცემები' } : { en: 'Product not found', ka: 'პროდუქტი ვერ მოიძებნა' }
      });
    }

    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/products/${id}`);
  }

  // Get all categories with their subcategories
  getCategories(): Observable<ApiResponse<Category[]>> {
    if (this.useMockData) {
      return of({ success: true, data: this.mockCategories, message: { en: 'Mock data', ka: 'მოკი მონაცემები' } });
    }

    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/categories`);
  }

  // Get category by ID with subcategories
  getCategoryById(id: string): Observable<ApiResponse<Category>> {
    if (this.useMockData) {
      const category = this.mockCategories.find(c => c.id === id);
      return of({ 
        success: !!category, 
        data: category!, 
        message: category ? { en: 'Mock data', ka: 'მოკი მონაცემები' } : { en: 'Category not found', ka: 'კატეგორია ვერ მოიძებნა' }
      });
    }

    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/categories/${id}`);
  }

  // Get subcategories by category ID
  getSubcategoriesByCategoryId(categoryId: string): Observable<ApiResponse<Subcategory[]>> {
    if (this.useMockData) {
      const category = this.mockCategories.find(c => c.id === categoryId);
      return of({ 
        success: !!category, 
        data: category?.subcategories || [], 
        message: { en: 'Mock data', ka: 'მოკი მონაცემები' }
      });
    }

    return this.http.get<ApiResponse<Subcategory[]>>(`${this.apiUrl}/categories/${categoryId}/subcategories`);
  }

  // Get products by type
  getProductsByType(type: ProductType): Observable<ApiResponse<Product[]>> {
    if (this.useMockData) {
      const products = this.mockProducts.filter(p => p.type === type);
      return of({ success: true, data: products, message: { en: 'Mock data', ka: 'მოკი მონაცემები' } });
    }

    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/products?type=${type}`);
  }

  // Get products by category
  getProductsByCategory(categoryId: string): Observable<ApiResponse<Product[]>> {
    if (this.useMockData) {
      const products = this.mockProducts.filter(p => 
        p.categories.some(cat => cat.id === categoryId)
      );
      return of({ success: true, data: products, message: { en: 'Mock data', ka: 'მოკი მონაცემები' } });
    }

    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/products?categoryIds=${categoryId}`);
  }

  // Get products by subcategory
  getProductsBySubcategory(subcategoryId: string): Observable<ApiResponse<Product[]>> {
    if (this.useMockData) {
      const products = this.mockProducts.filter(p => 
        p.subcategories.some(sub => sub.id === subcategoryId)
      );
      return of({ success: true, data: products, message: { en: 'Mock data', ka: 'მოკი მონაცემები' } });
    }

    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/products?subcategoryIds=${subcategoryId}`);
  }
}
