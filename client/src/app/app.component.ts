import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { UserInterface } from './api/models/user.interface';
import { UserService } from './api/services/user.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  authService = inject(AuthService);
  http = inject(HttpClient);
  private apiUrl = '/api/users';

  ngOnInit(): void {
    this.http.get<{ user: UserInterface }>(this.apiUrl).subscribe({
      next: (response) => {
        console.log('response', response);
        this.authService.currentUserSig.set(response.user);
      },
      error: () => {
        this.authService.currentUserSig.set(null);
      },
    });
  }

  logout(): void {
    console.log('logout');
    localStorage.setItem('token', '');
    this.authService.currentUserSig.set(null);
  }
}
