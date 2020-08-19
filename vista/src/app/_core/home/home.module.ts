import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { MaterialMenuSharedModule } from '../../_common/modules/shared-materials/materials-menu-shared.module';
import { TranslateSharedLazyModuleModule } from 'src/app/_common/modules/translate-shared-lazy-module/translate-shared-lazy-module.module';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { MessageModule } from '../../_common/components/message/message.module';
import { AlertModule } from '../../_common/components/alert/alert.module';
import { MatProgressSpinnerModule, MatChip, MatChipsModule, MatButtonModule, MatPaginatorIntl } from '@angular/material';
import { PaginatorIntlService } from '../../_common/services/paginator-intl.service';
import { TranslateService } from '@ngx-translate/core';
import {
  PerfectScrollbarModule, PerfectScrollbarConfigInterface,
  PERFECT_SCROLLBAR_CONFIG
} from 'ngx-perfect-scrollbar'; // scrollbar plugin
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};
@NgModule({
  declarations: [HomeComponent, HeaderComponent, FooterComponent],
  imports: [
    CommonModule,
    AlertModule,
    MessageModule,
    TranslateSharedLazyModuleModule,
    MaterialMenuSharedModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatButtonModule,
    HomeRoutingModule,
    PerfectScrollbarModule,
  ],
  exports: [
    MatProgressSpinnerModule,
    MatChipsModule,
    MatButtonModule
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useFactory: (translate) => {
        const service = new PaginatorIntlService();
        service.injectTranslateService(translate);
        return service;
      },
      deps: [TranslateService]
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class HomeModule { }
