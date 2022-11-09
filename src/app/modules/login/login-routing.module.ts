import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';

const APP_ROUTES: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: {
      title: 'Login Page',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(APP_ROUTES)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
