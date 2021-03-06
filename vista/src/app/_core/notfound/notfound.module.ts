import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import { NotfoundComponent } from './notfound.component';
import { TranslateSharedLazyModuleModule } from '../../_common/modules/translate-shared-lazy-module/translate-shared-lazy-module.module';

@NgModule({
  declarations: [NotfoundComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    TranslateSharedLazyModuleModule
  ],
  exports: [NotfoundComponent]
})
export class NotfoundModule { }
