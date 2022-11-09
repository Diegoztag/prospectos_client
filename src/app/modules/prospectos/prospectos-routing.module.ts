import { ProspectosFormComponent } from './prospectos-form/prospectos-form.component';
import { ProspectosListComponent } from './prospectos-list/prospectos-list.component';
import { ProspectosComponent } from './prospectos.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ProspectosComponent,
    children: [
      { path: '', component: ProspectosListComponent },
      { path: 'nuevo', data: { title: 'Nuevo' }, component: ProspectosFormComponent },
      { path: 'ver/:id', data: { title: 'Visualizar' }, component: ProspectosFormComponent },
    ],
  },
];

export const ProspectosRoutingModule = RouterModule.forChild(routes);
