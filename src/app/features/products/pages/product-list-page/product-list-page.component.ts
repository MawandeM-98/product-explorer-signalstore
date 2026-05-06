import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductStore } from '../../stores/product.store';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, LoadingSpinnerComponent, ProductFormComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Product Explorer</h1>
        <button
          (click)="showAddForm = !showAddForm"
          class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
        >
          + Add Product
        </button>
      </div>

      <!-- Add Product Form -->
      @if (showAddForm) {
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 class="text-xl font-semibold mb-4">Add New Product</h2>
          <app-product-form
            [isEditMode]="false"
            (submit)="onAddProduct($event)"
            (cancel)="showAddForm = false"
          />
        </div>
      }

      <!-- Search Bar -->
      <div class="mb-8">
        <div class="relative">
          <input
            type="text"
            [value]="store.searchTerm()"
            (input)="store.updateSearchTerm($any($event.target).value)"
            placeholder="Search products by title or category..."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          @if (store.searchTerm()) {
            <button
              (click)="store.clearSearch()"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          }
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <p class="text-sm opacity-90">Total Products</p>
          <p class="text-2xl font-bold">{{ store.totalProducts() }}</p>
        </div>
        <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <p class="text-sm opacity-90">Categories</p>
          <p class="text-2xl font-bold">{{ store.uniqueCategories().length }}</p>
        </div>
        <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <p class="text-sm opacity-90">Search Term</p>
          <p class="text-lg font-semibold truncate">{{ store.searchTerm() || 'None' }}</p>
        </div>
      </div>

      <!-- Loading State -->
      @if (store.isLoading()) {
        <app-loading-spinner />
      }

      <!-- Error State -->
      @else if (store.isError()) {
        <div class="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <p class="text-red-600 mb-4">{{ store.error() }}</p>
          <button
            (click)="store.loadProducts()"
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      }

      <!-- Empty State -->
      @else if (store.isEmpty()) {
        <div class="bg-gray-50 rounded-lg p-12 text-center">
          <p class="text-gray-500 text-lg">No products found. Add your first product!</p>
        </div>
      }

      <!-- No Search Results -->
      @else if (store.noSearchResults()) {
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <p class="text-yellow-700 mb-2">No products matching "{{ store.searchTerm() }}"</p>
          <button
            (click)="store.clearSearch()"
            class="text-blue-600 hover:text-blue-700 underline"
          >
            Clear search
          </button>
        </div>
      }

      <!-- Products Grid -->
      @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (product of store.filteredProducts(); track product.id) {
            <app-product-card [product]="product" />
          }
        </div>
      }
    </div>
  `
})
export class ProductListPageComponent implements OnInit {
  store = inject(ProductStore);
  showAddForm = false;
  
  ngOnInit(): void {
    this.store.loadProducts();
  }
  
  onAddProduct(productData: Partial<Product>): void {
    const cleanProduct: Omit<Product, 'id'> = {
      title: String(productData.title || ''),
      price: Number(productData.price) || 0,
      category: String(productData.category || ''),
      description: String(productData.description || ''),
      image: String(productData.image || `https://picsum.photos/200/200?random=${Date.now()}`),
      rating: Number(productData.rating) || 4.0
    };
    this.store.addProduct(cleanProduct);
    this.showAddForm = false;
  }
}