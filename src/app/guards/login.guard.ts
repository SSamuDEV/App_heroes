import { Injectable } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, RouterStateSnapshot, Route, UrlSegment, Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';


@Injectable({providedIn: 'root'})
export class LoginGuard implements CanActivate, CanMatch {

  private checkAuthStatus(): boolean | Observable<boolean> {

    return this.authService.checkAuthenication()
    .pipe(
      tap (isAuthenticated => console.log('Autentificado', isAuthenticated)),
      tap (isAuthenticated => {
        if (isAuthenticated ) {
          this.router.navigate(['/']);
        }
        map(isAuthenticated => !isAuthenticated);
      })
    )
  }


  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean > {
    return this.checkAuthStatus();
  }
  canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    return this.checkAuthStatus();
  }

}
