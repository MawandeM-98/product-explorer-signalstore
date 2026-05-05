import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { inject, computed } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, of, catchError, tap } from 'rxjs';
import { Product, RequestStatus } from '../models/product.model';
import { ProductService } from '../services/product.service';

interface ProductsState {
  products: Product[];
  searchTerm: string;
  selectedProductId: number | null;
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
  
  withComputed(({ products, searchTerm, status }) => ({
    filteredProducts: computed(() => {
      const term = searchTerm().toLowerCase();
      const allProducts = products();
      
      if (!term) return allProducts;
      
      return allProducts.filter(product => 
        product.title.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
    }),
    
    selectedProduct: computed(() => {
      const id = products().selectedProductId;
      const allProducts = products();
      return allProducts.find(product => product.id === id) || null;
    }),
    
    isLoading: computed(() => status() === 'loading'),
    isSuccess: computed(() => status() === 'success'),
    isError: computed(() => status() === 'error'),
    isEmpty: computed(() => products().length === 0 && status() === 'success'),
    noSearchResults: computed(() => {
      const term = searchTerm();
      const filtered = products();
      const filteredCount = filtered().filter(product => 
        product.title.toLowerCase().includes(term().toLowerCase()) ||
        product.category.toLowerCase().includes(term().toLowerCase())
      ).length;
      return term() && filteredCount === 0 && status() === 'success';
    }),
    
    totalProducts: computed(() => products().length),
    uniqueCategories: computed(() => {
      const categories = products().map(p => p.category);
      return [...new Set(categories)];
    })
  })),
  
  withMethods((store, productService = inject(ProductService)) => ({
    updateSearchTerm(term: string): void {
      patchState(store, { searchTerm: term });
    },
    
    clearSearch(): void {
      patchState(store, { searchTerm: '' });
    },
    
    selectProduct(id: number): void {
      patchState(store, { selectedProductId: id });
    },
    
    clearSelection(): void {
      patchState(store, { selectedProductId: null });
    },
    
    loadProducts: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { status: 'loading', error: null })),
        switchMap(() => 
          productService.getProducts().pipe(
            tap(products => {
              patchState(store, {
                products,
                status: 'success',
                error: null
              });
            }),
            catchError((error) => {
              patchState(store, {
                status: 'error',
                error: error.message || 'Failed to load products'
              });
              return of([]);
            })
          )
        )
      )
    ),
    
    addProduct: rxMethod<Omit<Product, 'id'>>(
      pipe(
        tap(() => patchState(store, { status: 'loading' })),
        switchMap((newProduct) =>
          productService.createProduct(newProduct).pipe(
            tap((createdProduct) => {
              patchState(store, {
                products: [...store.products(), createdProduct],
                status: 'success'
              });
            }),
            catchError((error) => {
              patchState(store, {
                status: 'error',
                error: error.message || 'Failed to add product'
              });
              return of(null);
            })
          )
        )
      )
    ),
    
    updateProduct: rxMethod<{ id: number; product: Partial<Product> }>(
      pipe(
        tap(() => patchState(store, { status: 'loading' })),
        switchMap(({ id, product }) =>
          productService.updateProduct(id, product).pipe(
            tap((updatedProduct) => {
              const updatedProducts = store.products().map(p =>
                p.id === id ? updatedProduct : p
              );
              patchState(store, {
                products: updatedProducts,
                status: 'success'
              });
            }),
            catchError((error) => {
              patchState(store, {
                status: 'error',
                error: error.message || 'Failed to update product'
              });
              return of(null);
            })
          )
        )
      )
    ),
    
    deleteProduct: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { status: 'loading' })),
        switchMap((id) =>
          productService.deleteProduct(id).pipe(
            tap(() => {
              const updatedProducts = store.products().filter(p => p.id !== id);
              patchState(store, {
                products: updatedProducts,
                status: 'success',
                selectedProductId: store.selectedProductId() === id ? null : store.selectedProductId()
              });
            }),
            catchError((error) => {
              patchState(store, {
                status: 'error',
                error: error.message || 'Failed to delete product'
              });
              return of(null);
            })
          )
        )
      )
    ),
    
    resetState(): void {
      patchState(store, initialState);
      store.loadProducts();
    }
  }))
);