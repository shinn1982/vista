import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';
// import {MdSnackBarRef} from './snack-bar-ref';
import { MatSnackBarRef } from '@angular/material';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  showMessage: boolean;
  /** The instance of the component making up the content of the snack bar. */
  snackBarRef: MatSnackBarRef<MessageComponent>;
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.showMessage = true;
  }

  ngOnInit() {
    // console.log('this.option:::: ', this);
    // console.log(this.data);
  }
  public close() {
    this.showMessage = false;
    this.snackBarRef.dismiss();
  }

}
