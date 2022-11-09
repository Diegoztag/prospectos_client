import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-aside',
  templateUrl: './app-aside.component.html',
})
export class AppAsideComponent implements OnInit {
  @Input() public messages: any;

  constructor() {}

  public ngOnInit() {}
}
