import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './message.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [MessageComponent],
  entryComponents: [MessageComponent],
  imports: [
    CommonModule,
    MatIconModule
  ]
})
export class MessageModule { }
