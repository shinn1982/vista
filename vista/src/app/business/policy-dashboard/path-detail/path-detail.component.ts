import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonService } from 'src/app/_common/services/common.service';
import { Subject } from 'rxjs';

import * as _ from 'lodash';
import { PathService } from '../services/path.service';

@Component({
  selector: 'app-path-detail',
  templateUrl: './path-detail.component.html',
  styleUrls: ['./path-detail.component.scss']
})
export class PathDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() pathInfo: any;
  @Output() closePathDetailEvent = new EventEmitter<any>();
  public refreshFlg: any = false;
  public refreshSubject: Subject<any> = new Subject<any>();
  constructor(
    private pathService: PathService,
    private commonService: CommonService
  ) { }

  public ngOnInit() {
    console.log('pathDetail init:', this.pathInfo);
    if (this.pathInfo) {
      this.pathInfo.path_type = this.pathInfo.path_type ? this.pathInfo.path_type : 'common';
      this.pathInfo.path_type_frm = this.pathInfo.path_type === 'common' ? 'Common' : 'SR';
    }
   }

  public ngAfterViewInit() {
    this.pathService.closeControlPanel.subscribe(() => {
      this.return();
    });
  }

  public ngOnDestroy() { }

  public return() {
    this.closePathDetailEvent.emit({ close: true});
    // this.pathService.selectedCPath.next(null);
  }

  public refresh() {
    this.refreshFlg = true;
    this.refreshSubject.next();
  }
}
