import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPolicyStatus'
})
export class FormatPolicyStatusPipe implements PipeTransform {

  transform(value: string): string {
    value += '';
    switch (value) {
      case '10':
        return 'POLICY_STATUS_NOT_RUNNING_CREATED';
      case '11':
        return 'POLICY_STATUS_NOT_RUNNING_STOPPED';
      case '12':
        return 'POLICY_STATUS_NOT_RUNNING_RUNNING_FAILED';
      case '13':
        return 'POLICY_STATUS_INACTIVE_WITHDRAW';
      case '20':
        return 'POLICY_STATUS_RUNNING';
      case '21':
        return 'POLICY_STATUS_RUNNING_PARTLY_DEPLOYED';
      case '22':
        return 'POLICY_STATUS_RUNNING_PREPARING';
      case '30':
        return 'POLICY_STATUS_REDEPLOYING';
      case '31':
        return 'POLICY_STATUS_WITHDRAWING';
      case '32':
        return 'POLICY_STATUS_ADVERTISING';
      case '40':
        return 'POLICY_STATUS_FAILED';
      case 'created':
        return 'POLICY_STATUS_CREATED';
      case 'withdraw':
        return 'POLICY_STATUS_WITHDRAW';
      case 'advertise':
        return 'POLICY_STATUS_ADVERTISE';
      case 'in_deleting':
        return 'POLICY_STATUS_IN_DELETING';
      case 'active':
        return 'POLICY_STATUS_ACTIVE';
      case 'inactive':
        return 'POLICY_STATUS_INACTIVE';
      default: return 'COMMON_USED_LABEL_UNKNOW';
    }
  }
}
