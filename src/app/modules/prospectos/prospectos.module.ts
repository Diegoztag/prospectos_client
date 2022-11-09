import { CiudadService } from './services/ciudad.service';
import { ProspectosService } from './services/prospectos.service';
import { ProspectosRoutingModule } from './prospectos-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProspectosComponent } from './prospectos.component';
import { ProspectosFormComponent } from './prospectos-form/prospectos-form.component';
import { ProspectosListComponent } from './prospectos-list/prospectos-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { BlockUIModule } from 'ng-block-ui';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { DirectivesModule } from '../../directives/directives.module';
import { TableModule } from 'primeng/table';
import { HuellaModule, HuellaService } from '@oc/ngx-huella';
import { EstatusPipe } from './pipes/estatus.pipe';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'ng2-file-upload';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  imports: [
    FileUploadModule,
    TextMaskModule,
    CommonModule,
    ProspectosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    OrderModule,
    NgxPaginationModule,
    TooltipModule.forRoot(),
    BlockUIModule,
    ModalModule.forRoot(),
    DirectivesModule,
    TableModule,
    CalendarModule,
    HuellaModule,
    DropdownModule,
    MultiSelectModule,
    CalendarModule,
    TypeaheadModule.forRoot(),
    SharedComponentsModule,
  ],
  declarations: [EstatusPipe, ProspectosComponent, ProspectosFormComponent, ProspectosListComponent],
  providers: [ProspectosService, HuellaService, CiudadService],
})
export class ProspectosModule {}
