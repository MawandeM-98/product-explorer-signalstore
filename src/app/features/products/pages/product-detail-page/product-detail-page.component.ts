import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductStore } from '../../stores/product.store';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <!-- deVere Header -->
    <div class="bg-[#0D1B3E] border-b border-[#1A2E5A]">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-2xl md:text-3xl font-bold text-white">
          deVere <span class="text-[#00C2B5]">productExplorer</span>
        </h1>
        <p class="text-[#6B7A99] text-sm mt-1">Product Details</p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Back Button -->
      <button
        (click)="goBack()"
        class="mb-6 flex items-center text-[#00C2B5] hover:text-[#00A89A] transition duration-200"
      >
        ← Back to Products
      </button>

      <!-- Loading State -->
      @if (store.isLoading()) {
        <app-loading-spinner />
      }

      <!-- Error State -->
      @else if (store.isError()) {
        <div class="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <p class="text-red-600 mb-4">{{ store.error() }}</p>
          <button
            (click)="goBack()"
            class="bg-[#00C2B5] text-white px-4 py-2 rounded-lg hover:bg-[#00A89A] transition duration-200"
          >
            Go Back
          </button>
        </div>
      }

      <!-- Product Found -->
      @else if (product) {
        <div class="bg-white rounded-lg shadow-md overflow-hidden border border-[#E2E8F0]">
          <div class="md:flex">
            <div class="md:w-1/2 bg-[#F5F7FA]">
              <img
                [src]="product.image"
                [alt]="product.title"
                class="w-full h-96 object-cover"
              />
            </div>
            <div class="md:w-1/2 p-6">
              <div class="flex justify-between items-start mb-4">
                <h1 class="text-3xl font-bold text-[#1A1A2E]">{{ product.title }}</h1>
                <span class="bg-[#F5F7FA] text-[#6B7A99] px-3 py-1 rounded-full text-sm border border-[#E2E8F0]">
                  {{ product.category }}
                </span>
              </div>

              <div class="flex items-center mb-4">
                <span class="text-[#00C2B5] text-xl">★</span>
                <span class="text-lg text-[#6B7A99] ml-1">{{ product.rating }}</span>
              </div>

              <p class="text-[#6B7A99] mb-6 leading-relaxed">{{ product.description }}</p>

              <div class="mb-6">
                <span class="text-4xl font-bold text-[#0D1B3E]">\${{ product.price }}</span>
              </div>

              <!-- Product Metadata -->
              <div class="border-t border-[#E2E8F0] pt-4 mt-4">
                <p class="text-sm text-[#6B7A99]">Product ID: <span class="text-[#1A1A2E] font-mono">{{ product.id }}</span></p>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Product Not Found -->
      @else {
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <p class="text-yellow-700 mb-4">Product not found!</p>
          <button
            (click)="goBack()"
            class="bg-[#00C2B5] text-white px-4 py-2 rounded-lg hover:bg-[#00A89A] transition duration-200"
          >
            Back to Products
          </button>
        </div>
      }
    </div>
  `
})
export class ProductDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  store = inject(ProductStore);

  product: Product | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.goBack();
      return;
    }

    if (this.store.products().length === 0) {
      this.store.loadProducts();
      const interval = setInterval(() => {
        if (this.store.status() !== 'loading') {
          clearInterval(interval);
          this.product = this.store.products().find(p => p.id === id) || null;
        }
      }, 50);
    } else {
      this.product = this.store.products().find(p => p.id === id) || null;
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}