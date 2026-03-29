import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-700">
      <mat-card class="w-full max-w-md p-8">
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <mat-icon class="text-white text-4xl">computer</mat-icon>
          </div>
          <h1 class="text-2xl font-bold text-gray-800">SpopoClaw Control Center</h1>
          <p class="text-gray-600 mt-2">Console d'administration et supervision</p>
        </div>

        <div class="space-y-4">
          <button 
            mat-raised-button 
            color="primary" 
            class="w-full py-3"
            (click)="login()">
            <mat-icon class="mr-2">login</mat-icon>
            Se connecter avec Google
          </button>
        </div>

        <div class="mt-6 text-center text-sm text-gray-500">
          <p>Accès réservé aux utilisateurs autorisés</p>
          <p class="mt-1">youssef.mahtat.as.developer@gmail.com</p>
          <p>spopoclaw@gmail.com</p>
        </div>
      </mat-card>
    </div>
  `
})
export class LoginComponent {
  constructor(private authService: AuthService) {}

  login(): void {
    this.authService.login();
  }
}
