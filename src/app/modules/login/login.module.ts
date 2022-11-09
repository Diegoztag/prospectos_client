import { ToasterModule } from 'angular2-toaster';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { HuellaModule, HuellaService } from '@oc/ngx-huella';
import { DirectivesModule } from '../../directives/directives.module';
import { LoginComponent, LoginHuellaComponent, LoginCDigitalComponent, LoginCustomComponent } from './login.component';

@NgModule({
  imports: [CommonModule, FormsModule, LoginRoutingModule, DirectivesModule, HuellaModule, ToasterModule.forChild()],
  declarations: [LoginComponent, LoginHuellaComponent, LoginCDigitalComponent, LoginCustomComponent],
  providers: [HuellaService],
})
export class LoginModule {}
