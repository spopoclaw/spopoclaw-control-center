import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/callback',
    loadComponent: () => import('./components/auth-callback/auth-callback.component').then(m => m.AuthCallbackComponent)
  },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'system',
        loadComponent: () => import('./components/system/system.component').then(m => m.SystemComponent)
      },
      {
        path: 'openclaw',
        loadComponent: () => import('./components/openclaw/openclaw.component').then(m => m.OpenclawComponent)
      },
      {
        path: 'audit',
        loadComponent: () => import('./components/audit/audit.component').then(m => m.AuditComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
