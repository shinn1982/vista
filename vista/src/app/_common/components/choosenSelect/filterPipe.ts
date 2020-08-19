import { Component, Input, AfterViewInit, Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: 'selectfilter'
})
export class SelectFilterPipe implements PipeTransform {

    transform(items: any[], args: string): any {
        let filtedArray: any[] = [];
        if (args) {
            items.forEach((item: any) => {
                if ((item['label'] + '').indexOf(args) !== -1) {
                    filtedArray.push(item);
                }
            });
        } else {
            filtedArray = items;
        }

        return filtedArray;
    }
}
