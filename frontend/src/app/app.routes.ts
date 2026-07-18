import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: "Kimaya's Kitchen | Home"
  },
  {
    path: 'menu',
    loadComponent: () => import('./pages/menu/menu.component').then(m => m.MenuComponent),
    title: "Kimaya's Kitchen | Our Menu"
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    title: "Kimaya's Kitchen | Our Story"
  },
  {
    path: 'reservations',
    loadComponent: () => import('./pages/reservations/reservations.component').then(m => m.ReservationsComponent),
    title: "Kimaya's Kitchen | Reserve a Table"
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),
    title: "Kimaya's Kitchen | Your Order"
  },
  {
    path: 'table-qr',
    loadComponent: () => import('./pages/table-qr/table-qr.component').then(m => m.TableQrComponent),
    title: "Kimaya's Kitchen | Table QR Generator"
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
