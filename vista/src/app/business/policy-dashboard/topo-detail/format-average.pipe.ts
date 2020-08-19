import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'formatAverage'
})
export class FormatAveragePipe implements PipeTransform {

  transform(value: any): string {
    let formatValue: any = '';
    if (value / 1E12 >= 1 || value / 1E12 >= 1) {
      formatValue = _.round(value / 1E12, 2) + ' T';
    } else if (value / 1E9 >= 1 || value / 1E9 >= 1) {
      formatValue = _.round(value / 1E9, 2) + ' G';
    } else if (value / 1E6 >= 1 || value / 1E6 >= 1) {
      formatValue = _.round(value / 1E6, 2) + ' M';
    } else if (value / 1E3 >= 1 || value / 1E3 >= 1) {
      formatValue = _.round(value / 1E3, 2) + ' K';
    } else {
      formatValue = _.round(value, 2);
    }
    return formatValue;
  }

}
