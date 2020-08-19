import { NgModule } from '@angular/core';
import { DisableControlDirective } from '../../directives/disable-control.directive';

@NgModule({
  declarations: [
    DisableControlDirective
  ],
  exports: [
    DisableControlDirective
  ]
})
export class SharedDirectiveModule {

}
