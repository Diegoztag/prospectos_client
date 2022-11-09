import { Component, OnInit, EventEmitter } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  // tslint:disable-next-line
  selector: 'app-root',
  template: '<block-ui></block-ui><toaster-container></toaster-container><router-outlet *ngIf="!isIframe"></router-outlet>',
})
export class AppComponent implements OnInit {
  @BlockUI() public blockUI: NgBlockUI;
  public isIframe = false;

  public ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;
  }
}
