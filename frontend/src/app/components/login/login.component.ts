import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule],
  template: `
    <div class="min-h-screen bg-dark-950 flex items-center justify-center relative overflow-hidden">
      <!-- Animated background -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary-600/20 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        <div class="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-primary-700/10 to-transparent rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 1.5s;"></div>
      </div>

      <!-- Grid pattern overlay -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <!-- Content -->
      <div class="relative z-10 w-full max-w-md px-6">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow">
            <mat-icon class="text-white text-4xl">terminal</mat-icon>
          </div>
          <h1 class="text-3xl font-bold text-white mb-2">SpopoClaw</h1>
          <p class="text-xl text-primary-400 font-medium">Control Center</p>
        </div>

        <!-- Card -->
        <div class="card p-8">
          <div class="text-center mb-8">
            <h2 class="text-xl font-semibold text-white mb-2">Bienvenue</h2>
            <p class="text-dark-400">Connectez-vous pour accéder à la console d'administration</p>
          </div>

          <!-- Features -->
          <div class="space-y-3 mb-8">
            <div class="flex items-center gap-3 text-sm text-dark-300">
              <div class="w-8 h-8 rounded-lg bg-success-dark/30 flex items-center justify-center">
                <mat-icon class="text-success-DEFAULT text-base">check_circle</mat-icon>
              </div>
              <span>Surveillance système en temps réel</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-dark-300">
              <div class="w-8 h-8 rounded-lg bg-success-dark/30 flex items-center justify-center">
                <mat-icon class="text-success-DEFAULT text-base">check_circle</mat-icon>
              </div>
              <span>Gestion OpenClaw & Workflows</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-dark-300">
              <div class="w-8 h-8 rounded-lg bg-success-dark/30 flex items-center justify-center">
                <mat-icon class="text-success-DEFAULT text-base">check_circle</mat-icon>
              </div>
              <span>Audit et sécurité avancés</span>
            </div>
          </div>

          <!-- Login button -->
          <button 
            (click)="login()"
            class="w-full btn-primary py-3 text-base gap-3">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Se connecter avec Google
          </button>

          <!-- Allowed users -->
          <div class="mt-6 pt-6 border-t border-dark-800">
            <p class="text-xs text-dark-500 text-center mb-3">Accès réservé aux utilisateurs autorisés</p>
            <div class="flex flex-wrap justify-center gap-2">
              <span class="badge-info">youssef.mahtat.as.developer@gmail.com</span>
              <span class="badge-info">spopoclaw@gmail.com</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <p class="text-center text-xs text-dark-600 mt-8">
          © 2026 SpopoClaw Control Center. Tous droits réservés.
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  constructor(private authService: AuthService) {}

  login(): void {
    this.authService.login();
  }
}
