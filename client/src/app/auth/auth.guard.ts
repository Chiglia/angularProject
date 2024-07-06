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
    const allowedRoles = route.data['allowedRoles'] as string[];

    return this.authService.currentUser$.pipe(
      map((user) => this.checkRoles(user?.roles || [], allowedRoles)),
      tap((allowed) => {
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
    return allowedRoles.some((role) => userRoles.includes(role));
  }
}
