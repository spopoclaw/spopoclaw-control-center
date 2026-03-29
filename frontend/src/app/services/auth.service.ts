import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private userSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getUserFromStorage(): User | null {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    if (token && email) {
      return { email, isAuthenticated: true };
    }
    return null;
  }

  login(): void {
    window.location.href = `${this.apiUrl}/login`;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    this.userSubject.next(null);
    window.location.href = '/login';
  }

  setToken(token: string, email: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    this.userSubject.next({ email, isAuthenticated: true });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getAllowedUsers(): Observable<{allowed_users: string[]}> {
    return this.http.get<{allowed_users: string[]}>(`${this.apiUrl}/allowed-users`);
  }
}
