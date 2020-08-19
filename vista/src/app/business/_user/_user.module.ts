import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserComponent } from './_user.component';
import { UserRoutingModule } from './_user-routing.module';
import { UserCreateComponent } from './_user-create/_user-create.component';
import { TranslateSharedLazyModuleModule } from 'src/app/_common/modules/translate-shared-lazy-module/translate-shared-lazy-module.module';
import { CommonMaterialSharedModule } from 'src/app/_common/modules/shared-materials/common-material-shared.module';
import { UserDetailComponent } from './_user-detail/_user-detail.component';
import { PipesSharedModule } from 'src/app/_common/modules/shared-pipe/pipes-shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    UserComponent,
    UserCreateComponent,
    UserDetailComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    TranslateSharedLazyModuleModule,
    CommonMaterialSharedModule,
    PipesSharedModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }
