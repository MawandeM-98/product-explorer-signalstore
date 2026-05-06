import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { inject, computed } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, of, catchError, tap, finalize } from 'rxjs';
import { Product, RequestStatus } from '../models/product.model';
import { ProductService } from '../services/product.service';

interface ProductsState {
  products: Product[];
  searchTerm: string;
  selectedProductId: string | null;
  status: RequestStatus;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  searchTerm: '',
  selectedProductId: null,
  status: 'idle',
  error: null
};

export const ProductStore = signalStore(
  { providedIn: 'root' },
  
  withState(initialState),
  
  withComputed((store) => ({
    filteredProducts: computed(() => {
      const term = store.searchTerm().toLowerCase();
      const allProducts = store.products();
      if (!term) return allProducts;
      return allProducts.filter(product =>
        product.title?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term)
      );
    }),

    selectedProduct: computed(() => {
      const id = store.selectedProductId();
      return store.products().find(product => product.id === id) || null;
    }),

    isLoading: computed(() => store.status() === 'loading'),
    isSuccess: computed(() => store.status() === 'success'),
    isError: computed(() => store.status() === 'error'),
    isEmpty: computed(() => store.products().length === 0 && store.status() === 'success'),

    noSearchResults: computed(() => {
      const term = store.searchTerm();
      if (!term) return false;
      const filtered = store.products().filter(product =>
        product.title?.toLowerCase().includes(term.toLowerCase()) ||
        product.category?.toLowerCase().includes(term.toLowerCase())
      );
      return filtered.length === 0 && store.status() === 'success';
    }),

    totalProducts: computed(() => store.products().length),

    uniqueCategories: computed(() => {
      const categories = store.products().map(p => p.category).filter(Boolean);
      return [...new Set(categories)];
    })
  })),
  
  withMethods((store, productService = inject(ProductService)) => {
    const loadProducts = rxMethod<void>(
      pipe(
        tap(() => patchState(store, { status: 'loading', error: null })),
        switchMap(() =>
          productService.getProducts().pipe(
            tap(products => {
              const validProducts = products.filter(p => p.title && p.id);
              patchState(store, { products: validProducts, status: 'success', error: null });
            }),
            catchError((error) => {
              patchState(store, { status: 'error', error: error.message || 'Failed to load products' });
              return of([]);
            })
          )
        )
      )
    );

    return {
      updateSearchTerm(term: string): void {
        patchState(store, { searchTerm: term });
      },

      clearSearch(): void {
        patchState(store, { searchTerm: '' });
      },

      selectProduct(id: string): void {
        patchState(store, { selectedProductId: id });
      },

      clearSelection(): void {
        patchState(store, { selectedProductId: null });
      },

      loadProducts,

      addProduct(newProduct: Omit<Product, 'id'>): void {
        patchState(store, { status: 'loading', error: null });
        
        productService.createProduct(newProduct).subscribe({
          next: (createdProduct) => {
            if (createdProduct && createdProduct.id) {
              patchState(store, {
                products: [...store.products(), createdProduct],
                status: 'success',
                error: null
              });
            }
          },
          error: (error) => {
            patchState(store, {
              status: 'error',
              error: error.message || 'Failed to add product'
            });
          }
        });
      },

      resetState(): void {
        patchState(store, initialState);
        loadProducts();
      }
    };
  })
);