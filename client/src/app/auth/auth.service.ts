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

  constructor(private http: HttpClient, private router: Router) {}

  getCurrentUser(): UserInterface | null {
    return this.currentUserSubject.value;
  }

  register(user: UserInterface): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        console.log('Registered user:', response.user); // Verifica che i ruoli siano presenti
        this.currentUserSubject.next(response.user);
        this.router.navigate(['/user']);
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        console.log('Logged:', response.user); // Verifica che i ruoli siano presenti
        this.currentUserSubject.next(response.user);
        this.router.navigate(['/user']);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
