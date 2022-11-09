import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

const API_URL = environment.authSources.custom.apiUrl;

@Injectable()
export class CustomService {
  private profile: any;

  constructor(private http: HttpClient) {}

  private _handleError(error: HttpErrorResponse) {
    let errorMessage = 'No se obtuvo respuesta del servidor de autenticación';
    if (error.error.data) errorMessage = error.error.data.userMessage;
    return throwError(() => new Error(errorMessage))
  }

  public me(): Observable<{ user }> {
    return this.http.get(API_URL + '/auth/me')
      .pipe(
        map(({ data }: any) => {
          this.profile = data;
          return this.profile;
        }),
        catchError(this._handleError)
      )
  }

  public login(credentials: any): Observable<{ user, token }> {
    return this.http
      .post(API_URL + '/auth/login', credentials)
      .pipe(
        map(({ data }: any) => {
          this.profile = data.usuario;
          return { user: data.usuario.numeroempleado, token: data.access_token };
        }),
        catchError(this._handleError)
      )
  }

  public getProfile(): Promise<any> {
    return new Promise((resolve) => {
      if (this.profile) {
        resolve(this.profile)
        return 0;
      }
      return this.me().subscribe((me) => resolve(me))
    })
  }

}