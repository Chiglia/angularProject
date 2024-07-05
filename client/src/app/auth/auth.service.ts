import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserInterface } from '../api/models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: UserInterface | null = null;
  private apiUrl = '/api'; // Usa il percorso relativo definito nel proxy.conf.json

  constructor(private http: HttpClient, private router: Router) {}

  getCurrentUser(): UserInterface | null {
    return this.currentUser;
  }

  register(user: UserInterface): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        this.currentUser = response.user;
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        this.currentUser = response.user;
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser = null;
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
