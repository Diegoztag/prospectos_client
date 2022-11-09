import { ModalModule } from 'ngx-bootstrap/modal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenPdfComponent } from './app-open-pdf/app-open-pdf.component';

@NgModule({
  imports: [CommonModule, ModalModule.forRoot()],
  declarations: [OpenPdfComponent],
  bootstrap: [OpenPdfComponent],
  exports: [OpenPdfComponent],
})
export class SharedComponentsModule {}
