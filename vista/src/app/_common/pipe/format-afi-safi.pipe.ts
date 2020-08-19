import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatAFISAFI'
})
export class FormaAFISAFIPipe implements PipeTransform {

  transform(value: string): string {
    value += '';
    switch (value) {
      case 'flowspec': return 'FSv4';
      case 'ipv4': return 'v4';
      case 'ipv4_unicast': return 'v4';
      case 'vpnv4': return 'VPNv4';
      case 'ipv4_srte': return 'SRv4';
      case 'bgpls': return 'LS';
      default: return 'COMMON_USED_LABEL_UNKNOW';
    }
  }
}
