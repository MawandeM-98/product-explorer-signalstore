import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductStore } from '../../stores/product.store';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent, ProductFormComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Back Button -->
      <button
        (click)="goBack()"
        class="mb-6 flex items-center text-blue-600 hover:text-blue-700"
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
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      } 
      
      <!-- Product Found -->
      @else if (product) {
        <!-- View Mode -->
        @if (!isEditing) {
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="md:flex">
              <div class="md:w-1/2">
                <img 
                  [src]="product.image" 
                  [alt]="product.title"
                  class="w-full h-96 object-cover"
                />
              </div>
              <div class="md:w-1/2 p-6">
                <div class="flex justify-between items-start mb-4">
                  <h1 class="text-3xl font-bold text-gray-800">{{ product.title }}</h1>
                  <span class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {{ product.category }}
                  </span>
                </div>
                
                <div class="flex items-center mb-4">
                  <div class="flex items-center">
                    <span class="text-yellow-400 text-xl">★</span>
                    <span class="text-lg text-gray-600 ml-1">{{ product.rating }}</span>
                  </div>
                </div>
                
                <p class="text-gray-600 mb-6 leading-relaxed">{{ product.description }}</p>
                
                <div class="mb-6">
                  <span class="text-4xl font-bold text-blue-600">\${{ product.price }}</span>
                </div>
                
                <div class="flex gap-3">
                  <button
                    (click)="isEditing = true"
                    class="flex-1 bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition duration-200"
                  >
                    ✏️ Edit Product
                  </button>
                  <button
                    (click)="onDelete()"
                    class="flex-1 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200"
                  >
                    🗑️ Delete Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        } 
        
        <!-- Edit Mode -->
        @else {
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold mb-4">Edit Product</h2>
            <app-product-form
              [product]="product"
              [isEditMode]="true"
              (submit)="onUpdateProduct($event)"
              (cancel)="isEditing = false"
            />
          </div>
        }
      } 
      
      <!-- Product Not Found -->
      @else {
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <p class="text-yellow-700 mb-4">Product not found!</p>
          <button
            (click)="goBack()"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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
  isEditing = false;
  
  ngOnInit(): void {
    // Get the ID from the route
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    if (id && !isNaN(id)) {
      // First load products if not already loaded
      if (this.store.products().length === 0) {
        this.store.loadProducts();
      }
      
      // Find the product from the store
      setTimeout(() => {
        this.product = this.store.products().find(p => p.id === id) || null;
        
        // If product still not found, try reloading products
        if (!this.product) {
          this.store.loadProducts();
          setTimeout(() => {
            this.product = this.store.products().find(p => p.id === id) || null;
          }, 500);
        }
      }, 100);
    } else {
      // Invalid ID, go back
      this.goBack();
    }
  }
  
  onUpdateProduct(productData: Partial<Product>): void {
    if (this.product) {
      this.store.updateProduct({ id: this.product.id, product: productData });
      this.isEditing = false;
      
      // Update the local product reference
      setTimeout(() => {
        this.product = this.store.products().find(p => p.id === this.product!.id) || null;
      }, 100);
    }
  }
  
  onDelete(): void {
    if (confirm('Are you sure you want to delete this product?')) {
      if (this.product) {
        this.store.deleteProduct(this.product.id);
        // Navigate back to list after deletion
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 100);
      }
    }
  }
  
  goBack(): void {
    this.router.navigate(['/']);
  }
}