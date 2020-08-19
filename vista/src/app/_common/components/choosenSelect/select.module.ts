import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SelectCommonComponent } from './selectcommon.component';
import { SelectFilterPipe } from './filterPipe';

@NgModule({
    imports: [FormsModule, CommonModule],
    exports: [SelectCommonComponent],
    declarations: [
        SelectCommonComponent, SelectFilterPipe
    ],
    entryComponents: [],
    providers: [],
})
export class SelectCommonModule { }
