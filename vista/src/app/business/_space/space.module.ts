import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpaceComponent } from './space.component';
import { SpaceRoutingModule } from './space-routing.module';
import { TranslateSharedLazyModuleModule } from 'src/app/_common/modules/translate-shared-lazy-module/translate-shared-lazy-module.module';
import { CommonMaterialSharedModule } from 'src/app/_common/modules/shared-materials/common-material-shared.module';
import { PipesSharedModule } from 'src/app/_common/modules/shared-pipe/pipes-shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SpaceCreateComponent } from './space-create/space-create.component';
import { SpaceDetailComponent } from './space-detail/space-detail.component';
import { SpaceUserComponent } from './space-user/space-user.component';
import { FormatFsmPipe, FormatContainerStatusPipe } from './space.pipe';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    SpaceComponent,
    SpaceCreateComponent,
    SpaceDetailComponent,
    SpaceUserComponent,
    FormatFsmPipe,
    FormatContainerStatusPipe,
  ],
  imports: [
    CommonModule,
    SpaceRoutingModule,
    TranslateSharedLazyModuleModule,
    CommonMaterialSharedModule,
    PipesSharedModule,
    ReactiveFormsModule,
    IonRangeSliderModule,
    DragDropModule
  ]
})
export class SpaceModule { }
