import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {

  constructor(
    public dialogRef: MatDialogRef<AlertComponent>,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('AlertComponent data', this.data);
    this.data.type = this.data.type || 'warn';
    // if (this.data.message) {
    //   this.message = this.data.message;
    // } else {
    //   this.message = this.translate.instant('COMMON_USED_LABEL_ALERT_MESSAGE', { object: this.data.obj, action: this.data.action });
    // }
    this.data.btnConfirm = this.data.btnConfirm || this.translate.instant('COMMON_USED_LABEL_BTN_CONFIRM');
    this.data.btnCancel = this.data.btnCancel || this.translate.instant('COMMON_USED_LABEL_BTN_CANCEL');
  }

}
