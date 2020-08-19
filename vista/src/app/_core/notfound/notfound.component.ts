import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent {

  constructor(private location: Location) {
    console.log(localStorage.getItem('language'));
  }

  goBack() {
    console.log(localStorage.getItem('language'));
    this.location.back();
  }

}
