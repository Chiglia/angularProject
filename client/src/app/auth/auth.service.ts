import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserInterface } from '../api/models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserInterface | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = '/api/users';

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      const user = this.parseJwt(token);
      if (user) {
        this.currentUserSubject.next({
          name: user.name,
          email: user.email,
          roles: user.roles,
        });
      } else {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    }
  }

  private setSession(authToken: string) {
    const user = this.parseJwt(authToken);
    localStorage.setItem('token', authToken);
    if (user) {
      this.currentUserSubject.next({
        name: user.name,
        email: user.email,
        roles: user.roles,
      });
    }
  }

  getCurrentUser(): UserInterface | null {
    return this.currentUserSubject.value;
  }

  register(user: UserInterface): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      tap((response: any) => {
        this.setSession(response.token);
        this.router.navigate(['/dash']);
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        this.setSession(response.token);
        this.router.navigate(['/dash']);
      })
    );
  }

  logout() {
    console.log('Logging out');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean | undefined {
    const user = this.getCurrentUser();
    return user?.roles.includes('admin');
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }
}
