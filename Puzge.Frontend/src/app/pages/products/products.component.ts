// src/app/pages/products/products.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { LanguageService } from '../../services/language.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { Subcategory } from '../../models/subcategory.model';
import { ProductType, getProductTypeDisplayText } from '../../enums/product-type.enum';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  filteredProducts: Product[] = [];

  // Filter states
  selectedType: ProductType | null = null;
  selectedCategories: string[] = [];
  selectedSubcategories: string[] = [];
  searchQuery: string = '';

  // UI states
  isLoading = false;
  showFilters = false;

  // Enums for template
  ProductType = ProductType;
  productTypes = Object.values(ProductType);

  constructor(
    private productService: ProductService,
    public languageService: LanguageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.handleRouteParams();
  }

  private handleRouteParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        this.selectedType = params['type'] as ProductType;
      }
      if (params['categories']) {
        this.selectedCategories = params['categories'].split(',');
      }
      if (params['subcategories']) {
        this.selectedSubcategories = params['subcategories'].split(',');
      }
      if (params['search']) {
        this.searchQuery = params['search'];
      }
      this.applyFilters();
    });
  }

  private loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  private loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.data;
          this.applyFilters();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      // Type filter
      if (this.selectedType && product.type !== this.selectedType) {
        return false;
      }

      // Category filter
      if (this.selectedCategories.length > 0) {
        const hasSelectedCategory = product.categories.some(category =>
          this.selectedCategories.includes(category.id)
        );
        if (!hasSelectedCategory) {
          return false;
        }
      }

      // Subcategory filter
      if (this.selectedSubcategories.length > 0) {
        const hasSelectedSubcategory = product.subcategories.some(subcategory =>
          this.selectedSubcategories.includes(subcategory.id)
        );
        if (!hasSelectedSubcategory) {
          return false;
        }
      }

      // Search filter
      if (this.searchQuery) {
        const searchLower = this.searchQuery.toLowerCase();
        const nameMatch = product.name.en.toLowerCase().includes(searchLower) ||
          product.name.ka.toLowerCase().includes(searchLower);
        const descMatch = product.description.en.toLowerCase().includes(searchLower) ||
          product.description.ka.toLowerCase().includes(searchLower);

        if (!nameMatch && !descMatch) {
          return false;
        }
      }

      return true;
    });

    this.updateUrlParams();
  }

  private updateUrlParams(): void {
    const queryParams: any = {};

    if (this.selectedType) {
      queryParams.type = this.selectedType;
    }
    if (this.selectedCategories.length > 0) {
      queryParams.categories = this.selectedCategories.join(',');
    }
    if (this.selectedSubcategories.length > 0) {
      queryParams.subcategories = this.selectedSubcategories.join(',');
    }
    if (this.searchQuery) {
      queryParams.search = this.searchQuery;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  onTypeChange(type: ProductType | null): void {
    this.selectedType = type;
    this.applyFilters();
  }

  onCategoryChange(categoryId: string, checked: boolean): void {
    if (checked) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories = this.selectedCategories.filter(id => id !== categoryId);
    }
    this.applyFilters();
  }

  onSubcategoryChange(subcategoryId: string, checked: boolean): void {
    if (checked) {
      this.selectedSubcategories.push(subcategoryId);
    } else {
      this.selectedSubcategories = this.selectedSubcategories.filter(id => id !== subcategoryId);
    }
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedType = null;
    this.selectedCategories = [];
    this.selectedSubcategories = [];
    this.searchQuery = '';
    this.applyFilters();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  getProductTypeDisplayText(type: ProductType): string {
    const displayText = getProductTypeDisplayText(type);
    return this.languageService.getCurrentLanguage() === 'ka' ? displayText.ka : displayText.en;
  }

  getSubcategoriesForCategory(categoryId: string): Subcategory[] {
    const category = this.categories.find(c => c.id === categoryId);
    return category?.subcategories || [];
  }

  isCategorySelected(categoryId: string): boolean {
    return this.selectedCategories.includes(categoryId);
  }

  isSubcategorySelected(subcategoryId: string): boolean {
    return this.selectedSubcategories.includes(subcategoryId);
  }
}
