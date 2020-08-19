import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatSecondsDHMS' })
export class FormatSecondsDHMSPipe implements PipeTransform {
    transform(value: string): string {
      if (!value) {
        return '';
      }
      const seconds = Number(value);
      const d = Math.floor(seconds / (3600 * 24));
      const h = Math.floor(seconds % (3600 * 24) / 3600);
      const m = Math.floor(seconds % 3600 / 60);
      const s = Math.floor(seconds % 3600 % 60);
      const dDisplay = d > 0 ? d + 'd' : '';
      const hDisplay = h > 0 ? h + 'h' : '';
      const mDisplay = m > 0 ? m + 'm' : '';
      const sDisplay = s > 0 ? s + 's' : '';
      return dDisplay + hDisplay + mDisplay + sDisplay;
    }
}
