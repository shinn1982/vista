import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as _ from 'lodash';

enum Type {
  Forwarding = 'Forwarding',
  Policy = 'Policy',
}
@Component({
  selector: 'app-policy-cpath-switch-panel',
  templateUrl: './policy-cpath-switch-panel.component.html',
  styleUrls: ['./policy-cpath-switch-panel.component.scss']
})
export class PolicyCpathSwitchPanelComponent implements OnInit {

  public forwardingList = [];
  public policyList = [];
  public currentCPath: any;
  public selectedPathVisList: any[];

  public policyChecked = false;
  constructor(
    public dialogRef: MatDialogRef<PolicyCpathSwitchPanelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.forwardingList = data.switchPathVisData.forwardingList;
    this.policyList = data.switchPathVisData.policyList;
    this.selectedPathVisList = _.clone(data.selectedPathVisList);

   }

  ngOnInit() {
  }

  checkedChange(ev: any, checkedItem: any) {
    // forwarding 里面只能选中一个
    // policy 里面可以选择多个
    // 只能选择一个类型
    if (ev.checked === false) {
      _.remove(this.selectedPathVisList, (cpath: any) => cpath.id === checkedItem.id);
      return true;
    }
    if (!_.find(this.selectedPathVisList, (cpath: any) => cpath.id === checkedItem.id)) {
      // 移除互斥类型
      if (checkedItem.data_source === Type.Forwarding) {
        _.remove(this.selectedPathVisList, (cpath: any) => cpath.data_source === Type.Policy);
      } else if (checkedItem.data_source === Type.Policy) {
        _.remove(this.selectedPathVisList, (cpath: any) => cpath.data_source === Type.Forwarding);
      }
      // this.selectedPathVisList.pop();
      this.selectedPathVisList.push(checkedItem);
    }
  }

  match(item: any) {
    return this.selectedPathVisList.find(c => c.id === item.id);
  }
  save() {
    this.dialogRef.close({ status: true, data: {selectedPathVisList: this.selectedPathVisList} });
  }

  cancel() {
    this.dialogRef.close({ status: false });
  }

}
