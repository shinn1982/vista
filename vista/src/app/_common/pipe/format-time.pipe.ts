import { Pipe, PipeTransform } from '@angular/core';
/*
 * Format time
 * Usage:
 *   value | formatTime
 * Example:
 *   {{ 2019-09-25T13:50:50Z | exponentialStrength }}
 *   formats to: 2019-09-25 13:50:50
*/
@Pipe({ name: 'formatTime' })
export class FormatTimePipe implements PipeTransform {
    transform(value: string): string {
        return value ? value.replace(/T/g, ' ').replace(/Z/g, '') : '';
    }
}
