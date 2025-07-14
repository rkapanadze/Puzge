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
import { Language } from '../../models/language.model';

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
  selectedTypes: ProductType[] = [];
  selectedCategories: string[] = [];
  selectedSubcategories: string[] = [];
  searchQuery: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  showAvailableOnly: boolean = false;
  showDiscountedOnly: boolean = false;
  sortBy: string = 'price-asc';

  // UI states
  isLoading = false;
  showFilters = false;
  currentLanguage: Language = 'en';
  categoriesExpanded: boolean = true;
  subcategoriesExpanded: boolean = true;
  priceRangeExpanded: boolean = true;

  // Pagination
  currentPage = 1;
  itemsPerPage = 12; // 4 products per row * 3 rows

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
    this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
    this.loadCategories();
    this.loadProducts();
    this.handleRouteParams();
  }

  private handleRouteParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        // Handle single type parameter from homepage
        this.selectedTypes = [params['type'] as ProductType];
      } else if (params['types']) {
        // Handle multiple types parameter
        this.selectedTypes = params['types'].split(',') as ProductType[];
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
      if (params['minPrice']) {
        this.minPrice = parseFloat(params['minPrice']);
      }
      if (params['maxPrice']) {
        this.maxPrice = parseFloat(params['maxPrice']);
      }
      if (params['available']) {
        this.showAvailableOnly = params['available'] === 'true';
      }
      if (params['discounted']) {
        this.showDiscountedOnly = params['discounted'] === 'true';
      }
      if (params['page']) {
        this.currentPage = parseInt(params['page']);
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
      // Type filter - check if product type is in selected types array
      if (this.selectedTypes.length > 0 && !this.selectedTypes.includes(product.type)) {
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

      // Price range filter
      if (this.minPrice !== null && (product.price === undefined || product.price < this.minPrice)) {
        return false;
      }
      if (this.maxPrice !== null && (product.price === undefined || product.price > this.maxPrice)) {
        return false;
      }

      // Availability filter
      if (this.showAvailableOnly && !product.isAvailable) {
        return false;
      }

      // Discounted filter
      if (this.showDiscountedOnly && !product.isDiscounted) {
        return false;
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

    // Reset to first page when filters change
    this.currentPage = 1;
    
    // Apply sorting
    this.sortProducts();
    
    this.updateUrlParams();
  }

  private sortProducts(): void {
    this.filteredProducts.sort((a, b) => {
      switch (this.sortBy) {
        case 'name-asc':
          return this.getLocalizedText(a.name).localeCompare(this.getLocalizedText(b.name));
        case 'name-desc':
          return this.getLocalizedText(b.name).localeCompare(this.getLocalizedText(a.name));
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'newest':
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
        default:
          return 0;
      }
    });
  }

  private updateUrlParams(): void {
    const queryParams: any = {};

    if (this.selectedTypes.length === 1) {
      // Use 'type' for single selection (consistent with homepage)
      queryParams.type = this.selectedTypes[0];
    } else if (this.selectedTypes.length > 1) {
      // Use 'types' for multiple selections
      queryParams.types = this.selectedTypes.join(',');
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
    if (this.minPrice !== null) {
      queryParams.minPrice = this.minPrice;
    }
    if (this.maxPrice !== null) {
      queryParams.maxPrice = this.maxPrice;
    }
    if (this.showAvailableOnly) {
      queryParams.available = 'true';
    }
    if (this.showDiscountedOnly) {
      queryParams.discounted = 'true';
    }
    if (this.currentPage > 1) {
      queryParams.page = this.currentPage;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  onTypeChange(type: ProductType): void {
    if (this.selectedTypes.includes(type)) {
      this.selectedTypes = this.selectedTypes.filter(t => t !== type);
    } else {
      this.selectedTypes.push(type);
    }
    this.applyFilters();
  }

  isTypeSelected(type: ProductType): boolean {
    return this.selectedTypes.includes(type);
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

  onPriceChange(): void {
    this.applyFilters();
  }

  onAvailabilityChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  toggleDiscountedOnly(): void {
    this.showDiscountedOnly = !this.showDiscountedOnly;
    this.applyFilters();
  }

  toggleCategories(): void {
    this.categoriesExpanded = !this.categoriesExpanded;
  }

  toggleSubcategories(): void {
    this.subcategoriesExpanded = !this.subcategoriesExpanded;
  }

  togglePriceRange(): void {
    this.priceRangeExpanded = !this.priceRangeExpanded;
  }

  clearFilters(): void {
    this.selectedTypes = [];
    this.selectedCategories = [];
    this.selectedSubcategories = [];
    this.searchQuery = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.showAvailableOnly = false;
    this.showDiscountedOnly = false;
    this.sortBy = 'price-asc';
    this.applyFilters();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  getProductTypeDisplayText(type: ProductType): string {
    const displayText = getProductTypeDisplayText(type);
    return this.currentLanguage === 'ka' ? displayText.ka : displayText.en;
  }

  getLocalizedText(text: { en: string; ka: string }): string {
    return this.currentLanguage === 'en' ? text.en : text.ka;
  }

  getDiscountPercentage(originalPrice: number, currentPrice: number): number {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  getAllSubcategories(): any[] {
    const allSubcategories: any[] = [];
    this.categories.forEach(category => {
      category.subcategories.forEach(subcategory => {
        allSubcategories.push({
          ...subcategory,
          categoryName: this.getLocalizedText(category.name)
        });
      });
    });
    return allSubcategories;
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

  // Pagination methods
  getPaginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      } else if (this.currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      }
    }
    
    return pages;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.updateUrlParams();
    }
  }
}
