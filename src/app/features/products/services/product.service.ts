import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiService = inject(ApiService);

  getProducts() {
    return this.apiService.getProducts();
  }

  getProductById(id: string) {
    return this.apiService.getProductById(id);
  }

  createProduct(product: Omit<Product, 'id'>) {
    return this.apiService.createProduct(product);
  }

  updateProduct(id: string, product: Partial<Product>) {
    return this.apiService.updateProduct(id, product);
  }

  deleteProduct(id: string) {
    return this.apiService.deleteProduct(id);
  }
}