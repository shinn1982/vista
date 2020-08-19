import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatSyncResult'
})
export class FormatSyncResultPipe implements PipeTransform {

    transform(value: string): string {
        value = (value + '').toUpperCase();
        switch (value) {
            case '0':
                return 'COMMON_USED_LABEL_SYNC_N';
            case '1':
                return 'COMMON_USED_LABEL_SYNC_Y';
            case '2':
                return 'COMMON_USED_LABEL_NA';
        }
    }
}
