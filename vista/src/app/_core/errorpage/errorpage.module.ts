import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import { ErrorpageComponent } from './errorpage.component';
import { TranslateSharedLazyModuleModule } from '../../_common/modules/translate-shared-lazy-module/translate-shared-lazy-module.module';

@NgModule({
  declarations: [ErrorpageComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    TranslateSharedLazyModuleModule
  ],
  exports: [ErrorpageComponent]
})
export class ErrorpageModule { }
