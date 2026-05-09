import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginPageComponent } from './features/auth/pages/login-page.component';
import { ProductListPageComponent } from './features/products/pages/product-list-page/product-list-page.component';
import { ProductDetailPageComponent } from './features/products/pages/product-detail-page/product-detail-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: '', component: ProductListPageComponent, canActivate: [authGuard] },
  { path: 'products/:id', component: ProductDetailPageComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];