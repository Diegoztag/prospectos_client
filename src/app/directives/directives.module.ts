import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestringirTipoDirective, Ng2SearchPipe } from './index';
import { UppercaseInputDirective } from '../directives/text-common/upper.directive'

@NgModule({
  imports: [CommonModule],
  declarations: [RestringirTipoDirective, Ng2SearchPipe, UppercaseInputDirective],
  exports: [RestringirTipoDirective, Ng2SearchPipe, UppercaseInputDirective],
})
export class DirectivesModule {}
