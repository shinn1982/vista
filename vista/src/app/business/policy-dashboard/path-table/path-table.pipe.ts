import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatStatus'
})
export class FormatStatusPipe implements PipeTransform {

  transform(value: any): string {
    switch (value) {
      case false:
      case 0:
        return 'DOWN';
      case true:
      case 1:
        return 'UP';
      default:
        return 'N/A';
    }
  }
}

@Pipe({ name: 'formatSegmentType' })
export class FormatSegmentTypePipe implements PipeTransform {
  transform(value: any): string {
    value += '';
    switch (value) {
      case '0':
        return '0 (IPv4 Explicit NULL)';
      case '2':
        return '2 (IPv6 Explicit NULL)';
      case '3':
        return '3 (Implicit NULL)';
      case 'node':
        return 'Node';
      case 'link':
        return 'Adj';
    }
  }
}

@Pipe({ name: 'formatSegmentStatus' })
export class FormatSegmentStatusPipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? 'COMMON_USED_LABEL_VALID' : 'COMMON_USED_LABEL_INVALID';
  }
}
