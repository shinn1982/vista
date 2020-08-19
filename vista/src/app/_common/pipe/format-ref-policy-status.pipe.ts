import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatRefPolicyStatus'
})
export class FormatRefPolicyStatus implements PipeTransform {

  transform(value: string): string {
    value += '';
    switch (value) {
      case 'inactive_created':
        return 'POLICY_STATUS_NOT_RUNNING_CREATED';
      case 'inactive_stop':
        return 'POLICY_STATUS_NOT_RUNNING_STOPPED';
      case 'inactive_failed':
        return 'POLICY_STATUS_NOT_RUNNING_RUNNING_FAILED';
      case 'inactive_withdraw':
        return 'POLICY_STATUS_INACTIVE_WITHDRAW';
      case 'active':
        return 'POLICY_STATUS_RUNNING';
      case 'active_partial':
        return 'POLICY_STATUS_RUNNING_PARTLY_DEPLOYED';
      case 'inactive_ready':
        return 'POLICY_STATUS_INACTIVE';
      case 'in_deploying':
        return 'POLICY_STATUS_INACTIVE_READY';
      case 'in_withdrawing':
        return 'POLICY_STATUS_WITHDRAWING';
      case 'in_advertising':
        return 'POLICY_STATUS_ADVERTISING';
      case 'failed':
        return 'POLICY_STATUS_FAILED';
      default: return 'COMMON_USED_LABEL_UNKNOW';
    }
  }
}
