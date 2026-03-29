import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../models';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <div class="min-h-screen bg-dark-950 flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-dark-900 border-r border-dark-800 flex flex-col fixed h-full z-30">
        <!-- Logo -->
        <div class="h-16 flex items-center px-6 border-b border-dark-800">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow">
              <mat-icon class="text-white text-xl">terminal</mat-icon>
            </div>
            <div>
              <h1 class="text-lg font-bold text-white leading-tight">SpopoClaw</h1>
              <p class="text-xs text-dark-400">Control Center</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p class="px-3 text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">Overview</p>
          
          <a routerLink="/dashboard" 
             routerLinkActive="active"
             class="nav-link"
             matTooltip="Tableau de bord"
             matTooltipPosition="right">
            <mat-icon class="text-lg">dashboard</mat-icon>
            <span>Dashboard</span>
          </a>

          <p class="px-3 text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2 mt-6">Infrastructure</p>

          <a routerLink="/system" 
             routerLinkActive="active"
             class="nav-link"
             matTooltip="Système"
             matTooltipPosition="right">
            <mat-icon class="text-lg">dns</mat-icon>
            <span>Système</span>
          </a>

          <a routerLink="/services" 
             routerLinkActive="active"
             class="nav-link"
             matTooltip="Services"
             matTooltipPosition="right">
            <mat-icon class="text-lg">miscellaneous_services</mat-icon>
            <span>Services</span>
          </a>

          <a routerLink="/containers" 
             routerLinkActive="active"
             class="nav-link"
             matTooltip="Containers"
             matTooltipPosition="right">
            <mat-icon class="text-lg">view_agenda</mat-icon>
            <span>Containers</span>
          </a>

          <p class="px-3 text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2 mt-6">Platform</p>

          <a routerLink="/openclaw" 
             routerLinkActive="active"
             class="nav-link"
             matTooltip="OpenClaw"
             matTooltipPosition="right">
            <mat-icon class="text-lg">smart_toy</mat-icon>
            <span>OpenClaw</span>
          </a>

          <a routerLink="/logs" 
             routerLinkActive="active"
             class="nav-link"
             matTooltip="Logs"
             matTooltipPosition="right">
            <mat-icon class="text-lg">receipt_long</mat-icon>
            <span>Logs</span>
          </a>

          <p class="px-3 text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2 mt-6">Security</p>

          <a routerLink="/audit" 
             routerLinkActive="active"
             class="nav-link"
             matTooltip="Audit"
             matTooltipPosition="right">
            <mat-icon class="text-lg">security</mat-icon>
            <span>Audit</span>
          </a>

          <a routerLink="/access" 
             routerLinkActive="active"
             class="nav-link"
             matTooltip="Contrôle d'accès"
             matTooltipPosition="right">
            <mat-icon class="text-lg">admin_panel_settings</mat-icon>
            <span>Accès</span>
          </a>
        </nav>

        <!-- Footer -->
        <div class="p-4 border-t border-dark-800">
          <div class="flex items-center gap-3 px-3 py-2 rounded-lg bg-dark-800/50">
            <div class="w-2 h-2 rounded-full bg-success-DEFAULT animate-pulse"></div>
            <span class="text-sm text-dark-400">System Operational</span>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 ml-64">
        <!-- Topbar -->
        <header class="h-16 bg-dark-900/80 backdrop-blur-md border-b border-dark-800 flex items-center justify-between px-6 sticky top-0 z-20">
          <!-- Breadcrumb -->
          <div class="flex items-center gap-2 text-sm text-dark-400">
            <mat-icon class="text-base">home</mat-icon>
            <span>/</span>
            <span class="text-dark-200">Dashboard</span>
          </div>

          <!-- Right section -->
          <div class="flex items-center gap-4">
            <!-- Search -->
            <div class="relative">
              <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500 text-base">search</mat-icon>
              <input type="text" 
                     placeholder="Rechercher..." 
                     class="w-64 bg-dark-950 border border-dark-800 rounded-lg pl-10 pr-4 py-2 text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500">
            </div>

            <!-- Notifications -->
            <button class="relative p-2 rounded-lg hover:bg-dark-800 transition-colors">
              <mat-icon class="text-dark-400">notifications</mat-icon>
              <span class="absolute top-1 right-1 w-2 h-2 bg-danger-DEFAULT rounded-full"></span>
            </button>

            <!-- User Menu -->
            <button [matMenuTriggerFor]="userMenu" class="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-lg hover:bg-dark-800 transition-colors">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <mat-icon class="text-white text-sm">person</mat-icon>
              </div>
              <div class="text-left hidden md:block">
                <p class="text-sm font-medium text-dark-200">{{ (user$ | async)?.email }}</p>
                <p class="text-xs text-dark-500">Administrateur</p>
              </div>
              <mat-icon class="text-dark-500 text-sm">expand_more</mat-icon>
            </button>

            <mat-menu #userMenu="matMenu" class="bg-dark-900 border border-dark-800">
              <button mat-menu-item class="hover:bg-dark-800">
                <mat-icon class="text-dark-400">person_outline</mat-icon>
                <span>Profil</span>
              </button>
              <button mat-menu-item class="hover:bg-dark-800">
                <mat-icon class="text-dark-400">settings</mat-icon>
                <span>Paramètres</span>
              </button>
              <mat-divider class="border-dark-800"></mat-divider>
              <button mat-menu-item (click)="logout()" class="hover:bg-dark-800 text-danger-light">
                <mat-icon class="text-danger-DEFAULT">logout</mat-icon>
                <span>Déconnexion</span>
              </button>
            </mat-menu>
          </div>
        </header>

        <!-- Page Content -->
        <main class="p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class LayoutComponent {
  user$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$;
  }

  logout(): void {
    this.authService.logout();
  }
}
