import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
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
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="h-screen">
      <mat-sidenav mode="side" opened class="w-64 bg-gray-900 text-white">
        <div class="p-6 border-b border-gray-700">
          <h1 class="text-xl font-bold flex items-center">
            <mat-icon class="mr-2">computer</mat-icon>
            SpopoClaw
          </h1>
          <p class="text-xs text-gray-400 mt-1">Control Center</p>
        </div>

        <nav class="p-4">
          <a mat-list-item 
             routerLink="/dashboard" 
             routerLinkActive="bg-primary-600"
             class="rounded-lg mb-1 hover:bg-gray-800">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Tableau de bord</span>
          </a>

          <a mat-list-item 
             routerLink="/system" 
             routerLinkActive="bg-primary-600"
             class="rounded-lg mb-1 hover:bg-gray-800">
            <mat-icon matListItemIcon>storage</mat-icon>
            <span matListItemTitle>Système</span>
          </a>

          <a mat-list-item 
             routerLink="/openclaw" 
             routerLinkActive="bg-primary-600"
             class="rounded-lg mb-1 hover:bg-gray-800">
            <mat-icon matListItemIcon>smart_toy</mat-icon>
            <span matListItemTitle>OpenClaw</span>
          </a>

          <a mat-list-item 
             routerLink="/audit" 
             routerLinkActive="bg-primary-600"
             class="rounded-lg mb-1 hover:bg-gray-800">
            <mat-icon matListItemIcon>history</mat-icon>
            <span matListItemTitle>Audit</span>
          </a>
        </nav>

        <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-300">
              <p>{{ (user$ | async)?.email }}</p>
            </div>
            <button mat-icon-button (click)="logout()" class="text-gray-300">
              <mat-icon>logout</mat-icon>
            </button>
          </div>
        </div>
      </mat-sidenav>

      <mat-sidenav-content class="bg-gray-100">
        <mat-toolbar class="bg-white shadow-sm">
          <span class="text-gray-700">Administration SpopoClaw</span>
        </mat-toolbar>
        
        <div class="p-6">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
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
