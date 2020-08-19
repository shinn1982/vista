import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatSessionStatus'
})
export class FormatSessionStatusPipe implements PipeTransform {

    transform(value: string): string {
        value += '';
        switch (value) {
            case 'ESTABLISHED':
                return value;
            case 'IDLE':
            case 'OPEN':
            case 'CONNECT':
                return 'IDLE';
            default:
                return 'N/A';
        }
    }
}
