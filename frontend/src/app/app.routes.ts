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
        path: 'services',
        loadComponent: () => import('./components/under-construction/under-construction.component').then(m => m.UnderConstructionComponent),
        data: { title: 'Services' }
      },
      {
        path: 'containers',
        loadComponent: () => import('./components/under-construction/under-construction.component').then(m => m.UnderConstructionComponent),
        data: { title: 'Containers' }
      },
      {
        path: 'openclaw',
        loadComponent: () => import('./components/openclaw/openclaw.component').then(m => m.OpenclawComponent)
      },
      {
        path: 'logs',
        loadComponent: () => import('./components/under-construction/under-construction.component').then(m => m.UnderConstructionComponent),
        data: { title: 'Logs' }
      },
      {
        path: 'audit',
        loadComponent: () => import('./components/audit/audit.component').then(m => m.AuditComponent)
      },
      {
        path: 'access',
        loadComponent: () => import('./components/under-construction/under-construction.component').then(m => m.UnderConstructionComponent),
        data: { title: 'Contrôle d\'accès' }
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
