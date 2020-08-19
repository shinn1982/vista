import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-errorpage',
  templateUrl: './errorpage.component.html',
  styleUrls: ['./errorpage.component.scss']
})
export class ErrorpageComponent implements OnInit, OnDestroy {

  public statusCode: string;
  public statusText: string;
  subscription: any;
  constructor(private route: ActivatedRoute, private location: Location) {
    this.subscription = this.route.queryParams.subscribe(params => {
      this.statusCode = params.statusCode ? params.statusCode : '500';
      this.statusText = params.statusText || '';
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  goBack() {
    this.location.back();
  }

}
