import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatContainerStatus'
})
export class FormatContainerStatusPipe implements PipeTransform {

    transform(value: string): string {
        value += '';
        return value.toLocaleUpperCase();
    }
}
