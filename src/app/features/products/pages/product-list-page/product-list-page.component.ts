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
    <div class="min-h-screen bg-[#F5F7FA]">
      <!-- deVere Header - Navy Background -->
      <div class="bg-[#0D1B3E] border-b border-[#1A2E5A]">
        <div class="container mx-auto px-4 py-6">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-white">
                deVere <span class="text-[#00C2B5]">productExplorer</span>
              </h1>
              <p class="text-[#6B7A99] text-sm mt-1">Global Product Catalogue</p>
            </div>
            <button
              (click)="showAddForm = !showAddForm"
              class="bg-[#00C2B5] text-white px-6 py-2 rounded-lg hover:bg-[#00A89A] transition duration-200 font-medium"
            >
              + Add Product
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="container mx-auto px-4 py-8">
        <!-- Add Product Form -->
        @if (showAddForm) {
          <div class="bg-white rounded-lg shadow-md p-6 mb-8 border border-[#E2E8F0]">
            <h2 class="text-xl font-semibold text-[#1A1A2E] mb-4">Add New Product</h2>
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
              class="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#00C2B5] focus:border-[#00C2B5] bg-white text-[#1A1A2E] placeholder-[#6B7A99]"
            />
            @if (store.searchTerm()) {
              <button
                (click)="store.clearSearch()"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7A99] hover:text-[#1A1A2E]"
              >
                ✕
              </button>
            }
          </div>
        </div>

        <!-- Stats Cards - Navy Theme -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-gradient-to-br from-[#0D1B3E] to-[#1A2E5A] rounded-lg p-6 shadow-lg">
            <p class="text-[#6B7A99] text-sm uppercase tracking-wide">Total Products</p>
            <p class="text-3xl font-bold text-white mt-2">{{ store.totalProducts() }}</p>
          </div>
          <div class="bg-gradient-to-br from-[#0D1B3E] to-[#1A2E5A] rounded-lg p-6 shadow-lg">
            <p class="text-[#6B7A99] text-sm uppercase tracking-wide">Categories</p>
            <p class="text-3xl font-bold text-white mt-2">{{ store.uniqueCategories().length }}</p>
          </div>
          <div class="bg-gradient-to-br from-[#0D1B3E] to-[#1A2E5A] rounded-lg p-6 shadow-lg">
            <p class="text-[#6B7A99] text-sm uppercase tracking-wide">Active Search</p>
            <p class="text-xl font-semibold text-[#00C2B5] mt-2 truncate">{{ store.searchTerm() || 'None' }}</p>
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
              class="bg-[#00C2B5] text-white px-4 py-2 rounded-lg hover:bg-[#00A89A] transition duration-200"
            >
              Retry
            </button>
          </div>
        }

        <!-- Empty State -->
        @else if (store.isEmpty()) {
          <div class="bg-white rounded-lg p-12 text-center border border-[#E2E8F0]">
            <p class="text-[#6B7A99] text-lg">No products found. Add your first product!</p>
          </div>
        }

        <!-- No Search Results -->
        @else if (store.noSearchResults()) {
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <p class="text-yellow-700 mb-2">No products matching "{{ store.searchTerm() }}"</p>
            <button
              (click)="store.clearSearch()"
              class="text-[#00C2B5] hover:text-[#00A89A] underline"
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