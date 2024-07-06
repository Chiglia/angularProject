import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const allowedRoles = route.data['allowedRoles'] as string[]; // Ottieni i ruoli consentiti dai data della rotta
    console.log(allowedRoles);

    return this.authService.currentUser$.pipe(
      map((user) => this.checkRoles(user?.roles || [], allowedRoles)),
      tap((allowed) => {
        console.log(allowed);
        if (!allowed) {
          this.router.navigate(['/error'], {
            queryParams: {
              message:
                'Access Denied: You do not have the necessary permissions to access this page.',
            },
          });
        }
      })
    );
  }

  private checkRoles(userRoles: string[], allowedRoles: string[]): boolean {
    console.log(userRoles);
    return allowedRoles.some((role) => userRoles.includes(role));
  }
}
