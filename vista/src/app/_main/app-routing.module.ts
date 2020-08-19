import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorpageComponent } from '../_core/errorpage/errorpage.component';
import { NotfoundComponent } from '../_core/notfound/notfound.component';
import { PreloadingStrategyService } from '../_common/services/preloading-strategy.service';
const appRoutes: Routes = [
  { path: '', redirectTo: 'index/policy-dashboard', pathMatch: 'full' },
  // { path: '**', redirectTo: 'index/notfound' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: false, preloadingStrategy: PreloadingStrategyService })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
