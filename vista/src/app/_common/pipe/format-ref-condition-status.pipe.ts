import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatRefConditionStatus'
})
export class FormatRefConditionStatus implements PipeTransform {

  transform(value: string): string {
    value = value.toLowerCase();
    switch (value) {
      case 'active':
        return 'CONDITION_ACTION_STATUS_ACTIVE';
      case 'advertise_failed':
        return 'CONDITION_ACTION_STATUS_ADVERTISE_FAILED';
      case 'withdraw_failed':
        return 'CONDITION_ACTION_STATUS_WITHDRAW_FAILED';
      case 'inactive':
        return 'CONDITION_ACTION_STATUS_INACTIVE';
      default: return 'COMMON_USED_LABEL_UNKNOW';
    }
  }
}
