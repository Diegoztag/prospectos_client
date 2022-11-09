import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SecureStorageService } from '../services';
import { environment } from 'src/environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private secureStorageService: SecureStorageService
  ) {}

  private setTokenHeaders(request: HttpRequest<any>) {
    return request.clone({
      setHeaders: {
        'Authorization': `${this.secureStorageService.getItem('token')}`,
        'Session-Type': `${this.secureStorageService.getItem('loginType')}`
      },
    });
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {    
    let requireAuth = environment.authApproach.some(source => request.url.includes(source));
    if (requireAuth) {
      if (sessionStorage.getItem('loginType') && sessionStorage.getItem('token')) {
        request = this.setTokenHeaders(request);
      }
    }
    return next.handle(request);
  }

}