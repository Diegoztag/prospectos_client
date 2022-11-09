import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID, APP_INITIALIZER, ApplicationRef } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import localeEsMx from '@angular/common/locales/es-MX';
registerLocaleData(localeEsMx);

// Import routing module
import { AppRoutingModule } from './app-routing.module';

// Import 3rd party components
import { MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ToasterModule } from 'angular2-toaster';
import { BlockUIModule } from 'ng-block-ui';

// Import Global Services

import { AuthGuard } from './guards/Auth.guard';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { SsoService } from './services/authentication/sso.service';
import { AadService } from './services/authentication/aad.service';
import { CustomService } from './services/authentication/custom.service';
import { SecureStorageService, AuthenticationService, MenuService, ConfigService } from './services/index';

// Import containers
import { FullLayoutComponent, SimpleLayoutComponent } from './containers';
const APP_CONTAINERS = [FullLayoutComponent, SimpleLayoutComponent];

import { SafeResourcePipe } from './core/pipes/safe-resource.pipe';
const APP_PIPES = [SafeResourcePipe];

// Import components
import {
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  AppSidebarNavComponent,
  AppSidebarNavDropdownComponent,
  AppSidebarNavItemComponent,
  AppSidebarNavLinkComponent,
  AppSidebarNavTitleComponent,
} from './core';
const APP_COMPONENTS = [
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  AppSidebarNavComponent,
  AppSidebarNavDropdownComponent,
  AppSidebarNavItemComponent,
  AppSidebarNavLinkComponent,
  AppSidebarNavTitleComponent,
];

// Import global directives
import {
  AsideToggleDirective,
  NavDropdownDirective,
  NavDropdownToggleDirective,
  ReplaceDirective,
  SidebarMinimizeDirective,
  SidebarOffCanvasCloseDirective,
  BrandMinimizeDirective,
  SidebarToggleDirective,
  MobileSidebarToggleDirective,
} from './core/directives';
const APP_DIRECTIVES = [
  AsideToggleDirective,
  NavDropdownDirective,
  NavDropdownToggleDirective,
  ReplaceDirective,
  SidebarMinimizeDirective,
  SidebarOffCanvasCloseDirective,
  BrandMinimizeDirective,
  SidebarToggleDirective,
  MobileSidebarToggleDirective,
];

export function ConfigLoader(configService: ConfigService) {
  return () => configService.getJSON();
}

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
const { tenantId, clientId, authorityUrl, redirectUri, graphUrl } = environment.authSources.AAD;

const msalAuthConfiguration = {
  auth: {
    clientId,
    authority: `${authorityUrl}/${tenantId}`,
    redirectUri: redirectUri
  }, cache: { cacheLocation: 'sessionStorage', storeAuthStateInCookie: isIE }
};
const msalGuardConfiguration: MsalGuardConfiguration = {
  interactionType: InteractionType.Redirect, // MSAL Guard Configuration
  authRequest: { scopes: ['User.Read'] }
}
const msalInterceptorConfiguration: MsalInterceptorConfiguration = {
  interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
  protectedResourceMap: new Map([[`${graphUrl}/v1.0/me`, ['User.Read']]])
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    HttpClientModule,
    TabsModule.forRoot(),
    ToasterModule.forRoot(),
    BlockUIModule.forRoot(),
    MsalModule.forRoot(new PublicClientApplication(msalAuthConfiguration), msalGuardConfiguration, msalInterceptorConfiguration)
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    ...APP_COMPONENTS,
    ...APP_DIRECTIVES,
    ...APP_PIPES
  ],
  providers: [
    AuthGuard,
    MsalGuard,
    SecureStorageService,
    AadService,
    SsoService,
    CustomService,
    AuthenticationService,
    MenuService,
    ConfigService,
    { provide: LOCALE_ID, useValue: 'es-MX' },
    { provide: LocationStrategy,  useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: ConfigLoader, deps: [ConfigService], multi: true },
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}
}
