import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { CommonService } from 'src/app/_common/services/common.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewChecked, AfterViewInit {
  public config: PerfectScrollbarConfigInterface = {};
  @ViewChild(PerfectScrollbarDirective, { static: true }) scrollbarRef?: PerfectScrollbarDirective;
  modules: string[];
  loadingFlg = false;
  public licenseMsgText: string;
  public subscriptions: Subscription = new Subscription();
  constructor(
    private commonService: CommonService,
    public router: Router,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.commonService.loaderSub.subscribe(flag => {
      this.loadingFlg = flag;
    });
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      this.commonService.hideLoader();
    });
  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngAfterViewInit() {
    this.subscriptions.add(this.commonService.licenseMsgSubject.subscribe(res => {
      this.licenseMsgText = res;
    }));
  }


}
