import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatCheckResult'
})
export class FormatCheckResultPipe implements PipeTransform {

    transform(value: string): string {
        value = (value + '').toUpperCase();
        switch (value) {
            case 'N/A':
                return 'DEVICE_CHECK_RESULT_NA';
            case 'CHECKING':
                return 'DEVICE_CHECK_RESULT_CHECKING';
            case 'TRUE':
                return 'DEVICE_CHECK_RESULT_TRUE';
            case 'FALSE':
                return 'DEVICE_CHECK_RESULT_FALSE';
            case 'UNCHECKED':
                return 'DEVICE_CHECK_RESULT_UNCHECKED';
            default:
                return 'DEVICE_CHECK_RESULT_UNKNOWN';

        }
    }
}
