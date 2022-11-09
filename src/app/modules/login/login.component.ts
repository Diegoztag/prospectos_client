
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { HuellaService } from '@oc/ngx-huella';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public authMechanisms = environment.authMechanisms;
  public loginSelected: string;
  public loginUnique: string;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthenticationService
  ) {

    let loginsWithForm = []
    let loginsWithButton = []

    for (const [loginType, isEnabled] of Object.entries(this.authMechanisms)) {
      if (isEnabled === true && loginType !== 'authcode') {
        loginsWithButton.push(loginType)
        if (loginType !== 'azureAD') {
          loginsWithForm.push(loginType)
        }
      }
    }
    if (loginsWithButton.length === 1 && loginsWithForm.length === 1) {
      this.loginUnique = this.loginSelected = loginsWithForm[0];
    }

  }

  public ngOnInit() {
    this.verify()
  }

  public verify() {
    this.route.queryParams.subscribe((params: Params) => {
      if (params.token) {
        this.auth.login('authCode', params.token);
      } else if (sessionStorage.getItem('loginType')) {
        this.auth.verifySession();
      } else {
        this.auth.logout();
      }
    });
  }

  public login(loginType, credentials={}) {
    this.auth.login(loginType, credentials)
  }

}

// -- Formularios para cada caso particular de Login

// -- 
@Component({ // Login Huella Digital
  selector: 'login-huella',
  templateUrl: './login-huella.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginHuellaComponent {
  @Output() credentials = new EventEmitter<any>();
  @Output() goback = new EventEmitter<any>();
  @Input() allowBack = false;
  constructor(private huellaService: HuellaService) {}
  public back() { this.goback.emit() }
  public login(f: NgForm) {
    this.huellaService.getHuella().subscribe({
      next: (respuesta) => {
        if (respuesta.error !== '') { this.credentials.emit({error: respuesta.error}) }
        else { this.credentials.emit({ user: f.form.value.numEmpleado, template: respuesta.template64 }) }
      },
      error: (error) => this.credentials.emit({erro: error.message})
    });
  }
}

// -- 
@Component({// Login Colaborador Digital
  selector: 'login-cdigital',
  templateUrl: './login-cdigital.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginCDigitalComponent {
  @Output() credentials = new EventEmitter<any>();
  @Output() goback = new EventEmitter<any>();
  @Input() allowBack = false;
  public back() { this.goback.emit() }
  public login(f: NgForm) { this.credentials.emit(f.form.value) }
}

// -- 
@Component({// Login Custom
  selector: 'login-custom',
  templateUrl: './login-custom.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginCustomComponent {
  @Output() credentials = new EventEmitter<any>();
  @Output() goback = new EventEmitter<any>();
  @Input() allowBack = false;
  public back() { this.goback.emit() }
  public login(f: NgForm) { this.credentials.emit(f.form.value) }
}