import { ToasterService } from 'angular2-toaster';
import { Mensaje } from './../../models/mensaje';
import { Component } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

// Import navigation elements
import { MenuService, AuthenticationService } from './../../services/index';

@Component({
  selector: 'app-sidebar-nav',
  template: `
    <nav class="sidebar-nav" *blockUI="'menu-data'">
      <ul class="nav">
        <ng-template ngFor let-navitem [ngForOf]="navigation">
          <li *ngIf="isDivider(navitem)" class="nav-divider"></li>
          <ng-template [ngIf]="isTitle(navitem)">
            <app-sidebar-nav-title [title]="navitem"></app-sidebar-nav-title>
          </ng-template>
          <ng-template [ngIf]="!isDivider(navitem) && !isTitle(navitem)">
            <app-sidebar-nav-item [item]="navitem"></app-sidebar-nav-item>
          </ng-template>
        </ng-template>
      </ul>
    </nav>
  `,
})
export class AppSidebarNavComponent {
  @BlockUI('menu-data')
  public blockUI: NgBlockUI;
  // public navigation = navigation;
  public navigation;
  public mensaje: Mensaje;
  public user: any;

  constructor(
    private menuData: MenuService,
    private auth: AuthenticationService,
    private toasterService: ToasterService
  ) {
    this.mensaje = new Mensaje(toasterService);
    this.user = this.auth.currentUser();
    this.loadMenu();
  }

  public isDivider(item) {
    if (item.divider) {
      return true;
    }
    return false;
  }
  public isTitle(item) {
    if (item.title) {
      return true;
    }
    return false;
  }

  public loadMenu() {
    this.blockUI.start('Loading...');
    this.menuData.getMenu().subscribe({
      next: (result) => {
        this.navigation = result;
        this.blockUI.stop();
        if (this.navigation.length > 0) {
          this.menuData.setExistMenu(true);
          document.querySelector('app-root')!.classList.remove('sidebar-hidden');
        }
      },
      error: (error) => {
        this.mensaje.messageError(error.error.message);
        // this.mensaje.messageError(error.data.userMessage);
      }
    });
  }
}
