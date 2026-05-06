import { Component, inject, input, output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          formControlName="title"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          [class.border-red-500]="productForm.get('title')?.invalid && productForm.get('title')?.touched"
        />
        @if (productForm.get('title')?.invalid && productForm.get('title')?.touched) {
          <p class="text-red-600 text-sm mt-1">Title is required</p>
        }
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Price *</label>
        <input
          type="number"
          formControlName="price"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          [class.border-red-500]="productForm.get('price')?.invalid && productForm.get('price')?.touched"
        />
        @if (productForm.get('price')?.invalid && productForm.get('price')?.touched) {
          <p class="text-red-600 text-sm mt-1">Price must be greater than 0</p>
        }
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Category *</label>
        <input
          type="text"
          formControlName="category"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          [class.border-red-500]="productForm.get('category')?.invalid && productForm.get('category')?.touched"
        />
        @if (productForm.get('category')?.invalid && productForm.get('category')?.touched) {
          <p class="text-red-600 text-sm mt-1">Category is required</p>
        }
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          formControlName="description"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input
          type="text"
          formControlName="image"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Rating</label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="5"
          formControlName="rating"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div class="flex gap-3 pt-4">
        <button
          type="submit"
          [disabled]="productForm.invalid"
          class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Product
        </button>
        <button
          type="button"
          (click)="cancel.emit()"
          class="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  `
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  
  product = input<Product | null>(null);
  isEditMode = input(false);
  submit = output<Partial<Product>>();
  cancel = output<void>();
  
  productForm!: FormGroup;
  
  ngOnInit(): void {
    this.productForm = this.fb.group({
      title: [this.product()?.title || '', Validators.required],
      price: [this.product()?.price || '', [Validators.required, Validators.min(0.01)]],
      category: [this.product()?.category || '', Validators.required],
      description: [this.product()?.description || ''],
      image: [this.product()?.image || 'https://picsum.photos/200/200?random=' + Date.now()],
      rating: [this.product()?.rating || 4.0, [Validators.min(0), Validators.max(5)]]
    });
  }
  
  onSubmit(): void {
    if (this.productForm.valid) {
      this.submit.emit(this.productForm.value);
    }
  }
}