import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/_common/services/common.service';
import { SpaceService } from '../space.service';
import { UserService } from '../../_user/user.service';
import { MatTableDataSource, PageEvent, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';

import * as _ from 'lodash';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-space-user',
  templateUrl: './space-user.component.html',
  styleUrls: ['./space-user.component.scss']
})
export class SpaceUserComponent implements OnInit, AfterViewInit, OnDestroy {

  public breadCrumbData = [];
  public role: any;

  public spaceRole: any;
  public spaceId: string;
  public spaceName: string;

  public userList = [];
  public selectedUser: string;

  public userNameCtrl = new FormControl('');
  public displayedColumns: string[];
  public dataSource: MatTableDataSource<any>;
  public pageEvent: PageEvent;
  public tableParams = {
    pageIndex: 0,
    pageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
    orderBy: 'created_on',
    order: 'desc',
    filterContent: '',
    numOfAll: 0
  };
  private subscriptions: Subscription;
  private paramFromList: any;
  private allSpaceUserList: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private spaceService: SpaceService,
    private userService: UserService,
    private translate: TranslateService
  ) { }

  public ngOnInit() {
    this.role = this.commonService.getCurrentUserInfos() ? this.commonService.getCurrentUserInfos().role : null;

    this.subscriptions = new Subscription();
    this.dataSource = new MatTableDataSource();
    this.displayedColumns = ['username', 'useralias', 'created_on', 'role', 'action'];

    this.getParams();
    this.commonService.setBreadCrumbData(this.setBreadCrumbData.bind(this));
    this.getAllSpaceUsers();
  }

  public ngAfterViewInit() {
    // filter
    fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.tableParams.filterContent = (this.filter.nativeElement as HTMLInputElement).value;
        this.tableParams.pageIndex = 0;
        this.getSpaceUsers();
      });
    // paginator
    this.paginator.page.subscribe((page: PageEvent) => {
      this.tableParams.pageIndex = page.pageIndex;
      this.tableParams.pageSize = page.pageSize;
      this.getSpaceUsers();
    });
    // sort
    this.sort.sortChange.subscribe(() => {
      this.tableParams.pageIndex = 0;
      if (!this.sort.direction) {
        this.sort.direction = 'asc';
      }
      this.tableParams.orderBy = this.sort.active;
      this.tableParams.order = this.sort.direction;
      this.getSpaceUsers();
    });
    // user
    this.userNameCtrl.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.subscriptions.add(this.userService.getUsers(value).subscribe(res => {
        this.userList = res.data.data_list || [];
      }));
    });
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public selectUser(username: string) {
    this.selectedUser = username;
  }

  public addUser() {
    // this.commonService.showLoader();
    // const data = {
    //   'username': this.selectedUser,
    //   'space_id': this.spaceId,
    //   'role': this.spaceRole
    // };
    // this.subscriptions.add(this.spaceService.addUser(data).subscribe(res => {
    //   if (res.status) {
    //     this.commonService.hideLoader();
    //     this.getSpaceUsers();
    //     this.selectedUser = '';
    //     this.spaceRole = '';
    //     this.commonService.showNewMessage(true, [this.translate.instant('COMMON_USED_LABEL_SUCCESS')]);
    //   } else {
    //     this.commonService.showNewMessage(false, [res.info.usr_err_mess]);
    //   }
    // }));
  }

  public save(user: any) {
    // this.commonService.showLoader();
    // const data = {
    //   'user_id': user.user_id,
    //   'space_id': this.spaceId,
    //   'role': user.role
    // };
    // this.subscriptions.add(this.spaceService.updateUser(data).subscribe(res => {
    //   this.commonService.hideLoader();
    //   const currentSpaceId = this.commonService.getCurrentSpaceId();
    //   const currentUserId = this.commonService.getCurrentUserInfos() ? this.commonService.getCurrentUserInfos().user_id : null;
    //   if (user.user_id === currentUserId && user.space_id === currentSpaceId) {
    //     // this.router.navigate(['/login']);
    //     this.commonService.showNewMessage(false, [this.translate.instant('SPACE_USER_CHANGE_MSG')]);
    //   } else {
    //     this.getSpaceUsers();
    //     this.commonService.showNewMessage(true, [this.translate.instant('COMMON_USED_LABEL_SUCCESS')]);
    //   }
    // }));
  }

  public delete(user: any) {
    // this.commonService.showLoader();
    // const data = {
    //   'user_id': user.user_id,
    //   'space_id': this.spaceId
    // };
    // this.subscriptions.add(this.spaceService.deleteUser(data).subscribe(res => {
    //   this.commonService.hideLoader();
    //   const currentUserId = this.commonService.getCurrentUserInfos() ? this.commonService.getCurrentUserInfos().user_id : null;
    //   if (user.user_id === currentUserId) {
    //     // this.router.navigate(['/login']);
    //   } else {
    //     this.getSpaceUsers();
    //     this.commonService.showNewMessage(true, [this.translate.instant('COMMON_USED_LABEL_SUCCESS')]);
    //   }
    // }));
  }

  public ableSave(index: number) {
    this.dataSource.data[index].disabled = false;
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
    const mainCrumbObj = { index: 0, path: 'index/space', label: this.translate.instant('HEADER_NAVBAR_SPACE'), disabled: false };
    const secondaryObj = { index: 1, path: '', label: `${this.translate.instant('SPACE_USER')} (${this.spaceName})`, disabled: true };
    this.breadCrumbData = [mainCrumbObj, secondaryObj];
  }

  private getParams() {
    const queryParams = this.route.snapshot.queryParamMap;
    this.paramFromList = queryParams.get('param') ? queryParams.get('param') : null;
    this.spaceId = queryParams.get('id') ? queryParams.get('id') : '';
    this.spaceName = queryParams.get('name') ? queryParams.get('name') : '';
  }

  private getAllSpaceUsers() {
    // this.subscriptions.add(this.spaceService.getAllSpaceUsers(this.spaceId).subscribe(res => {
    //   this.allSpaceUserList = res.data.data_list;
    //   this.getSpaceUsers();
    // }));
  }

  public getSpaceUsers() {
    // this.commonService.showLoader();
    // this.subscriptions.add(this.spaceService.getSpaceUsers(this.tableParams, this.spaceId).subscribe(res => {
    //   this.commonService.hideLoader();

    //   this.dataSource.data = res.data.data_list || [];
    //   if (this.dataSource.data.length === 0 && this.tableParams.pageIndex > 0) {
    //     this.tableParams.pageIndex = this.tableParams.pageIndex - 1;
    //     this.getSpaceUsers();
    //   }

    //   const currentUserId = this.commonService.getCurrentUserInfos() ? this.commonService.getCurrentUserInfos().user_id : '';
    //   this.role = _.filter(this.allSpaceUserList, ['user_id', currentUserId])[0].role;
    //   if (this.role === 'operator') {
    //     this.displayedColumns = ['username', 'useralias', 'created_on', 'role'];
    //   }
    //   this.dataSource.data.map((d, index) => {
    //     d.index = index;
    //     d.disabled = true;
    //   });
    //   this.tableParams.numOfAll = res.data.num_of_all;
    // }));
  }

}
