import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import { CommonService } from 'src/app/_common/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { PathService } from '../services/path.service';
import { PolicyCommonService } from '../services/policy-common.service';

@Component({
  selector: 'app-right-drawer',
  templateUrl: './right-drawer.component.html',
  styleUrls: ['./right-drawer.component.scss']
})
export class RightDrawerComponent implements OnInit, OnChanges {

  public currentPath: any;
  public flgs = {
    showPathDetail: false,
    showPathCreate: false,
    showLoader: false
  };
  public selectedIndex: number;

  // topo detail
  @Input() detailFlag: boolean;
  @Input() selectElements: any;
  @Input() filterValue: string;
  @Output() closeTopoDetailEvent = new EventEmitter<boolean>();
  constructor(
    private commonService: CommonService,
    private translate: TranslateService,
    private pathService: PathService,
    private policyCommonService: PolicyCommonService
  ) { }

  public ngOnInit() {
    this.pathService.filterNode.subscribe(() => {
      this.flgs.showPathDetail = false;
      this.selectedIndex = 0;
    });
    this.policyCommonService.loaderSubject.subscribe(flag => {
      this.flgs.showLoader = flag;
    });
  }

  public ngOnChanges(changes) {
    console.log('right-drawer->onChanges:', changes);
    console.log('right-drawer:', this.detailFlag);
    if (this.detailFlag) {
      this.flgs.showPathCreate = !this.detailFlag;
      this.flgs.showPathDetail = !this.detailFlag;
    }
  }

  public showPathDetail(event: any) {
    this.currentPath = event;
    this.flgs.showPathDetail = true;
  }

  public hidePathDetail(event: any) {
    if (event && event.close) {
      this.flgs.showPathDetail = false;
      this.currentPath = null;
    }
  }

  public showPathCreate(event: any) {
    console.log('debug showPathCreate:', event);
    this.currentPath = event;
    this.flgs.showPathCreate = true;
  }

  public hidePathCreate(event: any) {
    if (event && event.close) {
      this.flgs.showPathCreate = false;
      this.currentPath = null;
    }
  }

  public closeTopoDetail() {
    this.closeTopoDetailEvent.emit(true);
  }

}
