import { Component, OnInit } from '@angular/core';
import { AuthenticationService, ConfigService } from '../../services/index';
import { ToasterConfig } from 'angular2-toaster';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {
  private config: any;
  public imgUrl = 'assets/img/user-a.png';
  public appLogo: string;
  public user: any;
  public notificaciones: any[];
  public mensajes: any[];
  public haveMenu: boolean;

  public toasterconfig: ToasterConfig = new ToasterConfig({
    animation: 'slideDown',
  });

  constructor(
    // private auth: AuthenticationService,
    public configService: ConfigService) {
    this.notificaciones = [];
    this.mensajes = [];
    this.config = this.configService.config;
  }

  public ngOnInit() {
    this.haveMenu = this.config.haveMenu;
    this.appLogo = this.config.appLogo;
    // this.auth.currentUser().then(
    //   profile => {
    //     // console.log(profile);
    //   }
    // )
  }
}
