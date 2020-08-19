import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/_common/services/common.service';
import { UserService, UserDetailModel } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-detail',
  templateUrl: './_user-detail.component.html',
  styleUrls: ['./_user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {

  public breadCrumbData = [];
  public spaceDetail = [];
  public userDetail: UserDetailModel;
  private subscriptions: Subscription;
  private paramFromList: any;

  constructor(
    private commonService: CommonService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) { }

  public ngOnInit() {
    this.subscriptions = new Subscription();
    this.userDetail = new UserDetailModel();
    // get params
    const queryParams = this.route.snapshot.queryParamMap;
    const id = queryParams.get('id');
    this.paramFromList = queryParams.get('param') ? queryParams.get('param') : null;

    // request data
    this.getUserData(id);
    this.getSpaceData(id);

    // set bread crumb
    this.commonService.setBreadCrumbData(this.setBreadCrumbData.bind(this));
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public backToMainPage(crumbObj?: any) {
    let url = '';
    if (crumbObj && crumbObj.disabled) {
      return false;
    }
    url = crumbObj && crumbObj.path ? crumbObj.path : 'index/user';
    if (this.paramFromList) {
      this.router.navigate([url], { queryParams: { param: this.paramFromList } });
    } else {
      this.router.navigate([url]);
    }
  }

  private setBreadCrumbData() {
    const mainCrumbObj = { index: 0, path: 'index/user', label: this.translate.instant('HEADER_NAVBAR_USER'), disabled: false };
    const secondaryObj = { index: 1, path: '', label: this.translate.instant('USER_DETAIL'), disabled: true };
    this.breadCrumbData = [mainCrumbObj, secondaryObj];
  }

  private getUserData(userId: string) {
    // this.commonService.showLoader();
    // this.subscriptions.add(this.userService.getUserDetail(userId).subscribe(res => {
    //   this.commonService.hideLoader();

    //   const userList = res.data.data_list || [];
    //   const matchedUser = _.find(userList, (perUser) => {
    //     return perUser.id === userId;
    //   });
    //   if (matchedUser) {
    //     this.userDetail = matchedUser;
    //   } else {
    //     this.commonService.showNewMessage(false, [this.translate.instant('USER_NOT_EXIST')]);
    //   }
    // }));
  }

  private getSpaceData(userId: string) {
    // this.commonService.showLoader();
    // this.subscriptions.add(this.userService.getUserSpace(userId).subscribe(res => {
    //   this.commonService.hideLoader();
    //   this.spaceDetail = res.data;
    // }));
  }
}
