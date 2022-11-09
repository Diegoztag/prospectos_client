import { Injectable } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { SecureStorageService } from './secure-storage.service';
import { Mensaje } from '../models';
import { SsoService } from './authentication/sso.service';
import { AadService } from './authentication/aad.service';
import { CustomService } from './authentication/custom.service';

@Injectable()
export class AuthenticationService {
  @BlockUI() public blockUI: NgBlockUI;
  public settings: any;
  private mensaje: Mensaje;
  constructor(
    private router: Router,
    private toasterService: ToasterService,
    private secureStorageService: SecureStorageService,
    private aadService: AadService,
    private ssoService: SsoService,
    private customService: CustomService
  ) {
    this.mensaje = new Mensaje(toasterService);
  }

  // ------ Bloque de métodos de verificación de autenticación

  public verifySession() {
    const loginType = this.secureStorageService.getItem('loginType');
    console.log(loginType);
    switch (loginType) {
      case 'MSAL':
        let current = sessionStorage.getItem('token')
        if (current) this.router.navigate([''])
        this.aadService.load().then(([user, token]) => {
          this.setLogin('MSAL', user, token)
        })
        break;
      case 'SSO':
        this.ssoService.verify().then(
          ({ user, token }) => {
            this.setLogin('SSO', user, token)
          },
          (error) => this.mensaje.messageError(error)
        )
        break;
      case 'CST':
        this.customService.me().subscribe({
          next: (user) => {
            let token = this.secureStorageService.getItem('token')
            this.setLogin('SSO', user, token)
          },
          error: (error) => this.mensaje.messageError(error)
        })
        break;
    }
  }

  // ------ Bloque de métodos de lógica de autenticación

  public login(loginType, credentials) {
    this.blockUI.start('Loading...');
    switch (loginType) {

      case 'azureAD':
        this.secureStorageService.setItem('loginType', 'MSAL');
        this.aadService.login()
        break;

      case 'huella':
        this.ssoService.loginHuella(credentials).subscribe({
          next: ({ user, token }) => this.setLogin('SSO', user, token),
          error: (error) => this.mensaje.messageError(error)
        });
        break;

      case 'colaboradorDigital':
        this.ssoService.loginColaboradorDigital(credentials).subscribe({
          next: ({ user, token }) => this.setLogin('SSO', user, token),
          error: (error) => this.mensaje.messageError(error)
        });
        break;

      case 'authCode':
        this.ssoService.loginAuthCode(credentials).subscribe({
          next: (token) => {
            this.secureStorageService.setItem('loginType', 'SSO');
            this.secureStorageService.setItem('token', token);
            this.ssoService.verify().then(
              ({ user }) => this.setLogin('SSO', user, token),
              (error) => this.mensaje.messageError(error)
            )
          },
          error: (error) => this.mensaje.messageError(error)
        });
        break;

      case 'custom':
        this.customService.login(credentials).subscribe({
          next: ({ user, token }) => this.setLogin('CST', user, token),
          error: (error) => this.mensaje.messageError(error)
        });
        break;

    }
    this.blockUI.stop()
  }

  // ------ Getters

  public currentUser(): Promise<any> {
    return new Promise(resolve => {
      if (sessionStorage.getItem('loginType')) {
        const loginType = this.secureStorageService.getItem('loginType');
        switch (loginType) {
          case 'MSAL':
            this.aadService.getProfile().then(
              (profile) => resolve(profile),
              (error) => this.mensaje.messageError(error)
            );
            break;
          case 'SSO':
            this.ssoService.getProfile().then(
              (profile) => resolve(profile),
              (error) => this.mensaje.messageError(error)
            );
            break;
          case 'CST':
            this.customService.getProfile().then(
              (profile) => resolve(profile),
              (error) => this.mensaje.messageError(error)
            );
            break;
        }
      }
    })
  }

  public isAuth(): boolean {
    if (sessionStorage.getItem('currentUser')) {
      return true;
    } else {
      return false;
    }
  }

  // ------ Actions

  public logout() {
    if (sessionStorage.getItem('loginType')) {
      if (this.secureStorageService.getItem('loginType') === 'MSAL') this.aadService.logout();
      else this.router.navigate(['/login']);
    }
    sessionStorage.clear()
  }

  private setLogin(loginType, user: any, token: string, redirect = true) {
    this.secureStorageService.setItem('loginType', loginType);
    this.secureStorageService.setItem('currentUser', user);
    this.secureStorageService.setItem('token', token);
    if (redirect) this.router.navigate(['']);
  }

}
