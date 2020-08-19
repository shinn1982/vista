import {
    Component,
    ComponentFactory,
} from '@angular/core';

export class Options {
    type = 'basic'; // multi, group
    disabled = false;
    data: any = [];
    filter = false;
    // tslint:disable-next-line: variable-name
    filter_input = false;

}

