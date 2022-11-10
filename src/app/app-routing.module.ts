import { environment } from './../environments/environment';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

// Import Containers
import { FullLayoutComponent, SimpleLayoutComponent } from './containers';
// import { AuthGuard } from './guards/Auth.guard';

const isIframe = window !== window.parent && !window.opener;

export const APP_ROUTES: Routes = [
  {
    path: 'code',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Home',
    },
    children: [
      {
        path: 'prospectos',
        data: {
          title: 'Prospectos',
        },
        loadChildren: () => import('./modules/prospectos/prospectos.module').then((m) => m.ProspectosModule),
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES, { useHash: false, relativeLinkResolution: 'legacy', initialNavigation: !isIframe ? 'enabledBlocking' : 'disabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(private router: Router) {
    if (environment.production) {
      this.router.errorHandler = (_error: any) => {
        this.router.navigate(['/dashboard']); // or redirect to default route
      };
    }
  }
}
