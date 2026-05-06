import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <img 
        [src]="product().image" 
        [alt]="product().title"
        class="w-full h-48 object-cover"
      />
      <div class="p-4">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-semibold text-gray-800">{{ product().title }}</h3>
          <span class="text-sm text-gray-500">{{ product().category }}</span>
        </div>
        <div class="flex items-center mb-2">
          <div class="flex items-center">
            <span class="text-yellow-400">★</span>
            <span class="text-sm text-gray-600 ml-1">{{ product().rating }}</span>
          </div>
        </div>
        <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ product().description }}</p>
        <div class="flex justify-between items-center">
          <span class="text-2xl font-bold text-blue-600">\${{ product().price }}</span>
          <a 
            [routerLink]="['/products', product().id]"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 inline-block"
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