import { Subscription, Subject } from 'rxjs';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar} from '@angular/material';
import { MessageComponent } from './message.component';

@Injectable({
  providedIn: 'root'
})
export class MessageService implements OnDestroy {
  private snackBarRef: any;
  private msgQueue: any[] = [];
  private isInstanceVisible = false;
  private subscription: Subscription = new Subscription();
  constructor(public snackBar: MatSnackBar) {
  }

  showNext() {
    if (this.msgQueue.length === 0) {
      return;
    }

    const message = this.msgQueue.shift();
    this.isInstanceVisible = true;
    const messageRef = this.snackBar.openFromComponent(MessageComponent, message);
    messageRef.instance.snackBarRef = messageRef;
    messageRef.afterDismissed().subscribe(() => {
      this.isInstanceVisible = false;
      this.showNext();
      console.log('The snack-bar was dismissed');
    });
  }

  public dismiss() {
    this.msgQueue = [];
    this.snackBar.dismiss();
    this.subscription.unsubscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Add a message
   * @param status The label for the snackbar action.
   * @param message The message to show in the snackbar.
   * @param config Additional configuration options for the snackbar.
   */
  public add(status: string, msgs?: string): void {
    let duration = 1500;
    if (!status) {
      duration = 6000000;
    }
    const msgObj = {
      data: { status, msgs },
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration,
    };
    this.msgQueue.push(msgObj);
    if (!this.isInstanceVisible) {
      this.showNext();
    }
  }
}
