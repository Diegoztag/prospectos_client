import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html',
})
export class AppFooterComponent implements OnInit {
  private config: any;
  public copyRightYear: number;
  public footerTitle: string;

  constructor(public configService: ConfigService) {
    this.config = this.configService.config;
  }

  public ngOnInit() {
    this.copyRightYear = new Date().getFullYear();
    this.footerTitle = this.config.footerTitle;
  }
}
