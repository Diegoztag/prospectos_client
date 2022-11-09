import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { SecureStorageService } from '../secure-storage.service';

const API_URL = environment.authSources.SSO.apiUrl;

type ProfileType = {
  appId: string | null,
  email: string | null,
  user: string | null,
  userType: string,
  deviceId: string | null,
  pais: string | null,
  externo: boolean | null,
  me: string | null
};

@Injectable()
export class SsoService {

  private profile: ProfileType;
  constructor(private http: HttpClient, private secureStorageService: SecureStorageService) {}

  private _handleError(error: HttpErrorResponse) {
    let errorMessage = 'No se obtuvo respuesta del servidor de autenticación';    
    if (error.error.meta) errorMessage = error.error.meta.error.userMessage;
    return throwError(() => new Error(errorMessage))
  }

  // ------ Bloque de métodos de validación de token

  public verifySSOToken(): Observable<{ user, token }> {
    const headers = new HttpHeaders().set('Authorization', this.secureStorageService.getItem('token'))
    return this.http
      .post(API_URL + '/v1/verify', null, { headers: headers })
      .pipe(
        map((verification: {data: {user, token}}) => verification.data),
        catchError(this._handleError)
      )
  }

  public meSSOToken(): Observable<ProfileType> {
    const headers = new HttpHeaders().set('Authorization', this.secureStorageService.getItem('token'))
    return this.http.get(API_URL + '/v2/me', { headers: headers })
      .pipe(
        map(({ data }: any) => {
          this.profile = data;
          return this.profile
        }),
        catchError(this._handleError)
      )
  }

  // ------ Bloque de métodos de lógica de autenticación

  public loginHuella(credentials: any): Observable<{user, token}> {
    return this.http
      .post(API_URL + '/v2/login', credentials)
      .pipe(
        map(({ data }: any) => ({ user: credentials.user, token: data.token })),
        catchError(this._handleError)
      )
  }

  public loginColaboradorDigital(credentials: any): Observable<{ user, token }> {
    credentials.loginType = 10
    return this.http
      .post(API_URL + '/v2/login', credentials)
      .pipe(
        map(({data}: any) => ({ user: data.user.employeeId, token: data.token })),
        catchError(this._handleError)
      )
  }

  public loginAuthCode(authCode: any): Observable<string> {
    return this.http
      .post<any>(API_URL + '/v1/login/code', { authCode, appId: environment.appId })
      .pipe(
        map(({ data }: any) => data.token),
        catchError(this._handleError)
    )
  }

  public verify(): Promise<{ user, token }> {
    return new Promise((resolve) => {
      return this.verifySSOToken().subscribe(
        ({ token }) => {
          return this.meSSOToken().subscribe(
            ({ user }: any) => resolve({ user, token })
          )
        })
    })
  }

  // ------ Getters & Setters

  public getProfile(): Promise<ProfileType> {
    return new Promise((resolve) => {
      if (this.profile) {
        resolve(this.profile)
        return 0;
      }
      return this.meSSOToken().subscribe((me) => resolve(me))
    })
  }

}
