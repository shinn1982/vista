import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CommonService } from '../../_common/services/common.service';
import { HttpService } from '../../_common/services/httpService';
import { LicenseService } from '../../_common/services/license.service';
import { SpaceService } from 'src/app/business/_space/space.service';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public currentLang: string;
  public currentSpace: any;
  public spaceList: any;
  public userInfo: any;
  public flgs = {
    noSpace: false
  };

  private subscriptions = new Subscription();
  public functionType: any;

  private MOCK_USER_INFO = {
    user_id: 'mockuserid',
    username: 'admin'
  };
  private MOCK_SNAPSHOT_LIST = [
    { 'space_id': '1', 'space_name': 'Snapshot1' },
    { 'space_id': '2', 'space_name': 'Snapshot2' },
    { 'space_id': '3', 'space_name': 'Snapshot3' },
  ];
  constructor(
    public translate: TranslateService,
    private router: Router,
    private commonService: CommonService,
    private httpService: HttpService,
    private license: LicenseService,
    private spaceService: SpaceService) { }

  ngOnInit() {
    const language = localStorage.hasOwnProperty('language') ? localStorage.getItem('language') : this.translate.defaultLang;
    this.changeLanguage(language);
    // this.currentSpace = this.commonService.getCurrentSpace();
    // this.spaceList = this.setSpaceList(this.commonService.getSpaceList());
    // if (this.spaceList && this.spaceList.length === 0) {
    //   this.flgs.noSpace = true;
    //   this.currentSpace = { 'space_name': '无Snapshot' };
    // } else {
    //   this.flgs.noSpace = false;
    // }
    // this.subscriptions.add(this.commonService.usernameChange.subscribe(status => {
    //   if (status) {
    //     this.userInfo = this.MOCK_USER_INFO;
    //   }
    // }));
    // this.setSpaceListener();
    this.userInfo = this.MOCK_USER_INFO;
    this.spaceList = this.MOCK_SNAPSHOT_LIST;
    this.currentSpace = this.MOCK_SNAPSHOT_LIST[0];
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public changeLanguage(language: string) {
    if (!language || language === 'undefined') {
      language = 'zh-Hans';
    }
    this.currentLang = language;
    localStorage.setItem('language', language);
    this.translate.use(language);
    this.commonService.setAppTitle();
  }

  public openEdit() {
    // this.router.navigate(['index/user/user-action'], { queryParams: { id: this.userInfo.user_id } });
  }
  public signOut() {
    localStorage.removeItem(sessionStorage.getItem('current_user'));
    localStorage.setItem('logout', 'true');
    sessionStorage.clear();
  }

  public setSpaceList(sourceSpaceList: any) {
    return _.sortBy(
      sourceSpaceList,
      [(o: any) => o.space_name]
    );
  }

  public changeSpace(space: any) {
    if (!space.space_id) {
      space.space_id = space.id;
    }
    // this.commonService.setCurrentSpace(space);
    this.currentSpace = space;

    // const spaceId = space.space_id ? space.space_id : space.id;
    // const data = {
    //   'user_id': this.userInfo.user_id,
    //   'space_id': spaceId
    // };
    // this.spaceService.changeSpace(data).subscribe(res => {
    //   if (res.status === true) {
    //     const role = res.data.role;
    //     this.commonService.setRole(role);
    //     space.role = role;
    //     this.commonService.setCurrentSpace(space);
    //     if (this.router.url === '/index/policy-dashboard') {
    //       location.reload();
    //     } else {
    //       this.router.navigate(['index/policy-dashboard']);
    //     }
    //   }
    // });
  }

  private setSpaceListener() {
    this.spaceService.spaceList$.subscribe(spaceList => {
      spaceList = _.sortBy(
        spaceList,
        [(o: any) => o.space_name]
      );
      this.spaceList = spaceList;

      if (this.spaceList && this.spaceList.length === 0) {
        this.flgs.noSpace = true;
        this.currentSpace = { 'space_name': '无Snapshot' };
        this.commonService.setCurrentSpace(this.currentSpace);
      } else {
        this.flgs.noSpace = false;

        const currentSpaceId = this.commonService.getCurrentSpaceId();
        let changeFlag = true;
        _.each(spaceList, (space: any) => {
          if (space.id === currentSpaceId) {
            changeFlag = false;
          }
        });
        if (this.currentSpace.space_name === '无Snapshot' || changeFlag) {
          this.currentSpace = { 'space_name': '请选择Snapshot' };
          this.commonService.setCurrentSpace(this.currentSpace);
        }
      }
      this.commonService.setSpaceList(spaceList);
    }
    );

    this.spaceService.currentSpace$.subscribe(currentSpace => {
      this.currentSpace = currentSpace;
      this.commonService.setCurrentSpace(currentSpace);
    }
    );
  }

}
