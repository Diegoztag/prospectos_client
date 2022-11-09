import { Injectable } from '@angular/core';
import { Router, CanLoad, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Route, UrlSegment, UrlTree } from '@angular/router';
import { AuthenticationService } from '../services';

@Injectable()
export class AuthGuard implements CanLoad, CanActivate {
  
  constructor(private router: Router, private auth: AuthenticationService) {}

  public canLoad(_route: Route, _segments: UrlSegment[]): boolean | Promise<boolean | UrlTree> {
    if (!this.auth.isAuth()) return this.interrupt()
    return this.auth.currentUser()
  }

  public canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    if (!this.auth.isAuth()) return this.interrupt()
    return true
  }

  private interrupt(): boolean {
    // not logged in so redirect to login page with the return url
    // this.router.navigate(['/pages/login'], { queryParams: { returnUrl: state.url } });
    this.router.navigate(['/login']);
    return false;
  }

}