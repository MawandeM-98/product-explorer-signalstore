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
      <div class="container mx-auto px-4 py-4 md:py-6">
        <h1 class="text-xl md:text-2xl lg:text-3xl font-bold text-white">
          deVere <span class="text-[#00C2B5]">productExplorer</span>
        </h1>
        <p class="text-white text-sm md:text-base mt-1">
          Classy business attire catalogue catering strictly for deVere stakeholders
        </p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-6 md:py-8">
      <!-- Back Button -->
      <button
        (click)="goBack()"
        class="mb-4 md:mb-6 flex items-center text-[#00C2B5] hover:text-[#00A89A] transition duration-200 text-sm md:text-base"
      >
        ← Back to Products
      </button>

      <!-- Loading State -->
      @if (store.isLoading()) {
        <app-loading-spinner />
      }

      <!-- Error State -->
      @else if (store.isError()) {
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 md:p-8 text-center">
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
          <div class="flex flex-col md:flex-row">
            <!-- Image Section -->
            <div class="md:w-1/2 bg-[#F5F7FA] p-4 md:p-6">
              <div class="relative w-full pt-[100%] overflow-hidden rounded-lg">
                <img
                  [src]="product.image"
                  [alt]="product.title"
                  class="absolute top-0 left-0 w-full h-full object-contain"
                  (error)="handleImageError($event)"
                />
              </div>
            </div>
            
            <!-- Details Section -->
            <div class="md:w-1/2 p-4 md:p-6">
              <div class="flex flex-wrap justify-between items-start gap-2 mb-4">
                <h1 class="text-2xl md:text-3xl font-bold text-[#1A1A2E]">{{ product.title }}</h1>
                <span class="bg-[#F5F7FA] text-[#6B7A99] px-3 py-1 rounded-full text-sm border border-[#E2E8F0]">
                  {{ product.category }}
                </span>
              </div>

              <div class="flex items-center mb-4">
                <span class="text-[#00C2B5] text-lg md:text-xl">★</span>
                <span class="text-base md:text-lg text-[#6B7A99] ml-1">{{ product.rating }}</span>
              </div>

              <p class="text-[#6B7A99] mb-6 leading-relaxed text-sm md:text-base">
                {{ product.description }}
              </p>

              <div class="mb-6">
                <span class="text-3xl md:text-4xl font-bold text-[#0D1B3E]">€{{ product.price }}</span>
              </div>

              <!-- Product Metadata -->
              <div class="border-t border-[#E2E8F0] pt-4 mt-4">
                <p class="text-xs md:text-sm text-[#6B7A99]">
                  Product ID: <span class="text-[#1A1A2E] font-mono">{{ product.id }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Product Not Found -->
      @else {
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 md:p-8 text-center">
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

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'images/image0.jpeg';
  }
}