import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ElementRef, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSort, MatPaginator, MatTableDataSource, PageEvent, MatDialog } from '@angular/material';

import { UserService } from './user.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonService } from 'src/app/_common/services/common.service';
import { AlertComponent } from 'src/app/_common/components/alert/alert.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user',
  templateUrl: './_user.component.html',
  styleUrls: ['./_user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  public role: any;
  public displayedColumns: string[];
  public dataSource: MatTableDataSource<any>;
  public selection: SelectionModel<any>;
  public pageEvent: PageEvent;
  private subscriptions: Subscription;

  public tableParams = {
    pageIndex: 0,
    pageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
    orderBy: 'updated_on',
    order: 'desc',
    filterContent: '',
    numOfAll: 0
  };
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private commonService: CommonService,
    private userService: UserService,
    private translate: TranslateService,
    private detecRef: ChangeDetectorRef
  ) {
    this.getSnapshotParams();
  }

  public ngOnInit() {
    this.subscriptions = new Subscription();

    this.role = this.commonService.getCurrentUserInfos() ? this.commonService.getCurrentUserInfos().role : null;

    // init table
    this.dataSource = new MatTableDataSource();
    this.selection = new SelectionModel(true, []);
    this.displayedColumns = ['select', 'username', 'alias', 'phone_number', 'email', 'updated_on', 'visited_on', 'detail'];

    this.getUsers();
  }

  public ngAfterViewChecked() {
    this.detecRef.detectChanges();
  }

  public ngAfterViewInit() {
    if (this.tableParams.filterContent) {
      this.filter.nativeElement.value = this.tableParams.filterContent;
    }
    // filter
    fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.tableParams.filterContent = (this.filter.nativeElement as HTMLInputElement).value;
        this.tableParams.pageIndex = 0;
        this.getUsers();
      });
    // paginator
    this.paginator.page.subscribe((page: PageEvent) => {
      this.tableParams.pageIndex = page.pageIndex;
      this.tableParams.pageSize = page.pageSize;
      this.getUsers();
    });
    // sort
    this.sort.sortChange.subscribe(() => {
      this.tableParams.pageIndex = 0;
      if (!this.sort.direction) {
        this.sort.direction = 'asc';
      }
      this.tableParams.orderBy = this.sort.active;
      this.tableParams.order = this.sort.direction;

      this.getUsers();
    });
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public openDetail(userId: string) {
    this.router.navigate(['index/user/user-detail'], {
      queryParams: {
        id: userId,
        param: this.spliceParams()
      }
    });
  }

  public openCreate() {
    this.router.navigate(['index/user/user-action']);
  }

  public openEdit() {
    if (this.selection.selected) {
      const row = this.selection.selected[0];
      this.router.navigate(['index/user/user-action'], {
        queryParams: {
          id: row.id,
          param: this.spliceParams()
        }
      });
    }
  }

  public openDelete() {
    let delMsg = this.selection.selected[0].username;
    if (this.selection.selected.length > 1) {
      delMsg = delMsg + ` ${this.translate.instant('USER_DELETE_MSG', { number: this.selection.selected.length })}`;
    } else {
      delMsg = `${this.translate.instant('USER_TITLE')} ${delMsg}`;
    }

    // TODO wait alert component
    const dialogRef = this.dialog.open(AlertComponent, {
      disableClose: true,
      width: '20%',
      data: {
        obj: `${delMsg}`
      }
    });
    dialogRef.afterClosed().subscribe(status => {
      // let delRoot: any = false;
      // if (status) {
      //   this.commonService.showLoader();
      //   const idList = [];
      //   this.selection.selected.forEach(user => {
      //     if (user.username !== 'root') {
      //       idList.push(user.id);
      //     } else {
      //       delRoot = true;
      //     }
      //   });
      //   if (delRoot && idList.length === 0) {
      //     this.commonService.showNewMessage(false, [this.translate.instant('USER_DELETE_ROOT')]);
      //     this.commonService.hideLoader();
      //     return false;
      //   }
      //   this.userService.deleteUsers({ 'id_list': idList })
      //     .subscribe(res => {
      //       this.commonService.hideLoader();
      //       if (delRoot) {
      //         const msg = `${this.translate.instant('USER_DELETE_PARTIALLY_SUCCESS')}, ${this.translate.instant('USER_DELETE_ROOT')}`;
      //         this.commonService.showNewMessage(false, [msg]);
      //       } else {
      //         this.commonService.showNewMessage(true, [this.translate.instant('COMMON_USED_LABEL_SUCCESS')]);
      //       }
      //       this.getUsers();
      //     });
      // }
    });
  }

  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  public isOneSelected() {
    return this.selection.selected.length === 1;
  }

  public masterToggle() {
    if (!this.dataSource) {
      return;
    }
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  public getUsers() {
    // this.commonService.showLoader();
    // this.subscriptions.add(this.userService.getUserList(this.tableParams).subscribe(res => {
    //   this.commonService.hideLoader();

    //   this.dataSource.data = res.data.data_list || [];
    //   if (this.dataSource.data.length === 0 && this.tableParams.pageIndex > 0) {
    //     this.tableParams.pageIndex = this.tableParams.pageIndex - 1;
    //     this.getUsers();
    //   }
    //   this.tableParams.numOfAll = res.data.num_of_all;
    //   this.selection.clear();
    // }));
  }

  /**
   * Get the table parameter from the router queryParamMap
   */
  private getSnapshotParams() {
    const param = this.route.snapshot.queryParamMap.get('param');
    if (param) {
      const parArr = param.split('/');
      this.tableParams.pageIndex = parseInt(parArr[0], 0);
      this.tableParams.orderBy = parArr[1];
      this.tableParams.order = parArr[2];
      this.tableParams.pageSize = parseInt(parArr[3], 0);
      this.tableParams.filterContent = parArr[4];
      this.router.navigate(['index/user']);
    }
  }

  /**
   * Splice parameters for router
   */
  private spliceParams() {
    return `${this.tableParams.pageIndex}/` +
      `${this.tableParams.orderBy}/` +
      `${this.tableParams.order}/` +
      `${this.tableParams.pageSize}/` +
      `${this.tableParams.filterContent}`;
  }

}
