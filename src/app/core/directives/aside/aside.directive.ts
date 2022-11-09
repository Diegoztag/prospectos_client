import { Directive, HostListener } from '@angular/core';

/**
 * Allows the aside to be toggled via click.
 */
@Directive({
  selector: '[appAsideMenuToggler]',
})
export class AsideToggleDirective {
  constructor() {}

  @HostListener('click', ['$event'])
  public toggleOpen($event: any) {
    $event.preventDefault();
    document.querySelector('app-root')!.classList.toggle('aside-menu-hidden');
  }
}
