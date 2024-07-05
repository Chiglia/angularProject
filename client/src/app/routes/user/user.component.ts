import { Component } from '@angular/core';
import { UserInterface } from 'src/app/api/models/user.interface';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  currentUser: UserInterface | null = null;

  constructor(public authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout();
  }
}
