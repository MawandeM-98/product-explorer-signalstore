import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 border border-[#E2E8F0] h-full flex flex-col">
      <!-- Image Container with fixed aspect ratio -->
      <div class="relative w-full pt-[100%] bg-[#F5F7FA] overflow-hidden">
        <img 
          [src]="product().image" 
          [alt]="product().title"
          class="absolute top-0 left-0 w-full h-full object-cover hover:scale-105 transition duration-300"
          (error)="handleImageError($event)"
        />
      </div>
      
      <!-- Content -->
      <div class="p-4 flex flex-col flex-grow">
        <div class="flex justify-between items-start gap-2 mb-2">
          <h3 class="text-base md:text-lg font-semibold text-[#1A1A2E] line-clamp-2 flex-1">
            {{ product().title }}
          </h3>
          <span class="text-xs text-[#6B7A99] bg-[#F5F7FA] px-2 py-1 rounded whitespace-nowrap">
            {{ product().category }}
          </span>
        </div>
        
        <div class="flex items-center mb-2">
          <div class="flex items-center">
            <span class="text-[#00C2B5] text-sm md:text-base">★</span>
            <span class="text-sm text-[#6B7A99] ml-1">{{ product().rating }}</span>
          </div>
        </div>
        
        <p class="text-[#6B7A99] text-xs md:text-sm mb-3 line-clamp-2 flex-grow">
          {{ product().description }}
        </p>
        
        <div class="flex justify-between items-center mt-2">
          <span class="text-xl md:text-2xl font-bold text-[#0D1B3E]">€{{ product().price }}</span>
          <a 
            [routerLink]="['/products', product().id]"
            class="bg-[#00C2B5] text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-[#00A89A] transition duration-200 inline-block text-sm md:text-base font-medium"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  product = input.required<Product>();
  
  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'images/image0.jpeg'; // Fallback image
  }
}