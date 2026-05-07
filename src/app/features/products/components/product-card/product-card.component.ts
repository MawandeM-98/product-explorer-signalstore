import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 border border-[#E2E8F0]">
      <img 
        [src]="product().image" 
        [alt]="product().title"
        class="w-full h-48 object-cover"
      />
      <div class="p-4">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-semibold text-[#1A1A2E]">{{ product().title }}</h3>
          <span class="text-xs text-[#6B7A99] bg-[#F5F7FA] px-2 py-1 rounded">
            {{ product().category }}
          </span>
        </div>
        <div class="flex items-center mb-2">
          <div class="flex items-center">
            <span class="text-[#00C2B5]">★</span>
            <span class="text-sm text-[#6B7A99] ml-1">{{ product().rating }}</span>
          </div>
        </div>
        <p class="text-[#6B7A99] text-sm mb-3 line-clamp-2">{{ product().description }}</p>
        <div class="flex justify-between items-center">
          <span class="text-2xl font-bold text-[#0D1B3E]">\${{ product().price }}</span>
          <a 
            [routerLink]="['/products', product().id]"
            class="bg-[#00C2B5] text-white px-4 py-2 rounded-lg hover:bg-[#00A89A] transition duration-200 inline-block font-medium"
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
}