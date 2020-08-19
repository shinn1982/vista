import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadingStrategy, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './home.component';
import { ResolverService } from '../../_common/services/resolver.service';
import { AuthGuard } from '../../_auth/guards/auth.guard';
import { NotfoundComponent } from '../notfound/notfound.component';
import { ErrorpageComponent } from '../errorpage/errorpage.component';
const homeRoutes: Routes = [
  {
    path: 'index',
    component: HomeComponent,
    // canActivate: [AuthGuard],
    // canActivateChild: [AuthGuard],
    children: [
      {
        path: 'policy-dashboard',
        loadChildren: () => import('../../business/policy-dashboard/policy-dashboard.module').then(mod => mod.PolicyDashboardModule),
        // resolve: { crisis: ResolverService },
        data: { preload: false }
      },
      {
        path: 'user',
        loadChildren: () => import('../../business/_user/_user.module').then(mod => mod.UserModule),
        // resolve: { crisis: ResolverService },
        data: { preload: false }
      },
      {
        path: 'space',
        loadChildren: () => import('../../business/_space/space.module').then(mod => mod.SpaceModule),
        // resolve: { crisis: ResolverService },
        data: { preload: false }
      },
      { path: 'notfound', component: NotfoundComponent },
      { path: 'errorpage', component: ErrorpageComponent },
      { path: '**', redirectTo: 'notfound' }

    ]
  },
  { path: '**', redirectTo: 'notfound' }
];

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
