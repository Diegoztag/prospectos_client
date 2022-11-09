import { Component, OnInit, Input } from '@angular/core';
import { MenuService, AuthenticationService } from './../../services/index';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent implements OnInit {
  @Input() public imgUrl: string;
  @Input() public appLogo: string;
  @Input() public user: any;
  @Input() public notifications: any[];
  @Input() public messages: any[];

  public imgUrlError;

  // @Output() onLogout: EventEmitter<any> = new EventEmitter();

  public subscription: Subscription;
  public menuExist = false;

  constructor(private menuData: MenuService, private auth: AuthenticationService) {
    this.imgUrlError = 'assets/img/avatars/user-a.png';
  }

  public logOut() {
    setTimeout(() => {
      this.auth.logout();
    }, 100);
  }

  public ngOnInit() {
    document.querySelector('app-root')!.classList.add('aside-menu-hidden');
    this.subscription = this.menuData.navItem$.subscribe({
      next: (value) => {
        this.menuExist = value;
      }
    });
  }
}
