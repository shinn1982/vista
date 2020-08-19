import { Pipe, PipeTransform } from '@angular/core';
import { FSM_STATUS_DIC, CONTAINER_STATUS_DIC } from '../../_config/app.conf';

@Pipe({
  name: 'formatFsm'
})
export class FormatFsmPipe implements PipeTransform {
  transform(value: string): string {
    return FSM_STATUS_DIC[value];
  }
}

@Pipe({
  name: 'formatContainerStatus'
})
export class FormatContainerStatusPipe implements PipeTransform {
  transform(value: string): string {
    return CONTAINER_STATUS_DIC[value];
  }
}
