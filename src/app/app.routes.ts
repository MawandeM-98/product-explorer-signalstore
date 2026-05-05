import { Routes } from '@angular/router';
import { ProductListPageComponent } from './features/products/pages/product-list-page/product-list-page.component';
import { ProductDetailPageComponent } from './features/products/pages/product-detail-page/product-detail-page.component';

export const routes: Routes = [
  { path: '', component: ProductListPageComponent },
  { path: 'products/:id', component: ProductDetailPageComponent },
  { path: '**', redirectTo: '' }
];