import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/admin/products/products.component').then(m => m.ProductsComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./pages/admin/category/category.component').then(m => m.CategoryComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/admin/user/user.component').then(m => m.UserComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./pages/admin/report/report.component').then(m => m.ReportComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  // Other routes...
];