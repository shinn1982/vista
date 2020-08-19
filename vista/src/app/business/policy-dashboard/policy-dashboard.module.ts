import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolicyDashboardRoutingModule } from './policy-dashboard-routing.module';
import { TopologyComponent } from './topology.component';
import { TopoDetailComponent } from './topo-detail/topo-detail.component';
import { TopoPathComponent } from './topo-path/topo-path.component';
import { TopoSettingsComponent } from './topo-settings/topo-settings.component';
import { TopoSidebarComponent } from './topo-sidebar/topo-sidebar.component';
import { SelectCommonModule } from 'src/app/_common/components/choosenSelect/select.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';
import { TranslateSharedLazyModuleModule } from 'src/app/_common/modules/translate-shared-lazy-module/translate-shared-lazy-module.module';
import { PipesSharedModule } from 'src/app/_common/modules/shared-pipe/pipes-shared.module';
import { RightDrawerComponent } from './right-drawer/right-drawer.component';
import { PathTableComponent } from './path-table/path-table.component';
import { CommonMaterialSharedModule } from 'src/app/_common/modules/shared-materials/common-material-shared.module';
import { FormatStatusPipe, FormatSegmentTypePipe, FormatSegmentStatusPipe } from './path-table/path-table.pipe';
import { PolicyCpathSwitchPanelComponent } from './policy-cpath/policy-cpath-switch-panel/policy-cpath-switch-panel.component';
import { PolicyPathControlPanelComponent } from './policy-cpath/policy-path-control-panel/policy-path-control-panel.component';
import { FormatAveragePipe } from './topo-detail/format-average.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PathDetailComponent } from './path-detail/path-detail.component';
import { PathCreateComponent } from './path-create/path-create.component';
import { NodeLinkSelectionComponent } from './path-create/node-link-selection/node-link-selection.component';
import { MatRippleModule } from '@angular/material';


@NgModule({
  declarations: [
    TopologyComponent,
    TopoDetailComponent,
    TopoPathComponent,
    TopoSettingsComponent,
    TopoSidebarComponent,
    RightDrawerComponent,
    PathDetailComponent,
    PathTableComponent,
    FormatStatusPipe,
    FormatSegmentTypePipe,
    FormatSegmentStatusPipe,
    PolicyCpathSwitchPanelComponent,
    PolicyPathControlPanelComponent,
    FormatAveragePipe,
    PathCreateComponent,
    NodeLinkSelectionComponent,
  ],
  entryComponents: [TopoSettingsComponent, PolicyCpathSwitchPanelComponent, NodeLinkSelectionComponent],
  imports: [
    CommonModule,
    PolicyDashboardRoutingModule,
    SelectCommonModule,
    PerfectScrollbarModule,
    FormsModule,
    SelectCommonModule,
    IonRangeSliderModule,
    TranslateSharedLazyModuleModule,
    PipesSharedModule,
    CommonMaterialSharedModule,
    DragDropModule,
    ReactiveFormsModule,
    MatRippleModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PolicyDashboardModule { }
