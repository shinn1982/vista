import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/_common/services/common.service';
import { SpaceService, SpaceDetailModel } from '../space.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-space-detail',
  templateUrl: './space-detail.component.html',
  styleUrls: ['./space-detail.component.scss']
})
export class SpaceDetailComponent implements OnInit, OnDestroy {

  public breadCrumbData = [];
  public sessionDetail = [];
  public spaceDetail: SpaceDetailModel;
  private subscriptions: Subscription;
  private paramFromList: any;

  constructor(
    private spaceService: SpaceService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) { }

  public ngOnInit() {

    this.subscriptions = new Subscription();
    this.spaceDetail = new SpaceDetailModel();

    // get params
    const queryParams = this.route.snapshot.queryParamMap;
    const id = queryParams.get('id');
    this.paramFromList = queryParams.get('param') ? queryParams.get('param') : null;

    // request data
    this.getSpaceData(id);
    this.getSessionData(id);

    // set bread crumb
    this.setBreadCrumbData();
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public backToMainPage(crumbObj?: any) {
    let url = '';
    if (crumbObj && crumbObj.disabled) {
      return false;
    }
    url = crumbObj && crumbObj.path ? crumbObj.path : 'index/space';
    if (this.paramFromList) {
      this.router.navigate([url], { queryParams: { param: this.paramFromList } });
    } else {
      this.router.navigate([url]);
    }
  }

  private setBreadCrumbData() {
    const mainCrumbObj = { index: 0, path: 'index/space', label: 'HEADER_NAVBAR_SPACE', disabled: false };
    const secondaryObj = { index: 1, path: '', label: 'SPACE_DETAIL', disabled: true };
    this.breadCrumbData = [mainCrumbObj, secondaryObj];
  }

  private getSpaceData(id: string) {
    // this.commonService.showLoader();
    // this.subscriptions.add(this.spaceService.getSpaceDetail(id).subscribe(res => {
    //   this.commonService.hideLoader();
    //   const spaceList = res.data.data_list || [];
    //   const matchSpace = _.find(spaceList, space => {
    //     return space.id = id;
    //   });
    //   if (matchSpace) {
    //     this.spaceDetail = matchSpace;
    //     this.spaceDetail.node_name_regex_list = _.sortBy(this.spaceDetail.node_name_regex_list, 'priority');
    //   }
    // }));
  }

  private getSessionData(id: string) {
    // this.commonService.showLoader();
    // this.subscriptions.add(this.spaceService.getSpaceSession(id).subscribe(res => {
    //   this.commonService.hideLoader();
    //   this.sessionDetail = res.data.data_list || [];
    // }));
  }
}
