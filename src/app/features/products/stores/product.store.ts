import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { inject, computed } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, of, catchError, tap } from 'rxjs';
import { Product, RequestStatus } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { AuthStore } from '../../auth/stores/auth.store';

interface ProductsState {
  products: Product[];
  searchTerm: string;
  selectedProductId: string | null;
  status: RequestStatus;
  addProductStatus: RequestStatus;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  searchTerm: '',
  selectedProductId: null,
  status: 'idle',
  addProductStatus: 'idle',
  error: null
};

export const ProductStore = signalStore(
  { providedIn: 'root' },
  
  withState(initialState),
  
  withComputed((store) => {
    const authStore = inject(AuthStore);
    
    // Define filteredProducts first
    const filteredProducts = computed(() => {
      const term = store.searchTerm().toLowerCase();
      const allProducts = store.products();
      const currentUser = authStore.currentUser();
      const isAdmin = currentUser?.role === 'admin';
      
      if (!currentUser) return [];
      
      // Filter based on user role and product ownership
      let visibleProducts = allProducts.filter(product => {
        // Hardcoded products (no createdBy field) - show to everyone
        if (!product.createdBy) {
          return true;
        }
        
        // Admin sees everything
        if (isAdmin) {
          return true;
        }
        
        // Regular user sees only their own products OR products with no createdBy
        return product.createdBy === currentUser.username;
      });
      
      // Apply search filter
      if (!term) return visibleProducts;
      return visibleProducts.filter(product =>
        product.title?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term)
      );
    });
    
    return {
      filteredProducts,
      
      selectedProduct: computed(() => {
        const id = store.selectedProductId();
        return store.products().find(product => product.id === id) || null;
      }),

      isLoading: computed(() => store.status() === 'loading'),
      isAddingProduct: computed(() => store.addProductStatus() === 'loading'),
      isSuccess: computed(() => store.status() === 'success'),
      isError: computed(() => store.status() === 'error'),
      isEmpty: computed(() => filteredProducts().length === 0 && store.status() === 'success'),

      noSearchResults: computed(() => {
        const term = store.searchTerm();
        if (!term) return false;
        const filtered = filteredProducts();
        return filtered.length === 0 && store.status() === 'success';
      }),

      totalProducts: computed(() => filteredProducts().length),

      uniqueCategories: computed(() => {
        const categories = filteredProducts().map(p => p.category).filter(Boolean);
        return [...new Set(categories)];
      })
    };
  }),
  
  withMethods((store, productService = inject(ProductService), authStore = inject(AuthStore)) => {
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
        if (store.addProductStatus() === 'loading') {
          return;
        }
        
        const currentUser = authStore.currentUser();
        const productWithCreator = {
          ...newProduct,
          createdBy: currentUser?.username || 'unknown'
        };
        
        patchState(store, { addProductStatus: 'loading', error: null });
        
        productService.createProduct(productWithCreator).subscribe({
          next: (createdProduct) => {
            if (createdProduct && createdProduct.id && createdProduct.title) {
              const currentProducts = store.products();
              const exists = currentProducts.some(p => p.id === createdProduct.id);
              if (!exists) {
                patchState(store, {
                  products: [...currentProducts, createdProduct],
                  addProductStatus: 'success',
                  status: 'success',
                  error: null
                });
              } else {
                patchState(store, { addProductStatus: 'success', error: null });
              }
            }
          },
          error: (error) => {
            patchState(store, {
              addProductStatus: 'error',
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