import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { MatTableDataSource, PageEvent, MatDialog, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, fromEvent } from 'rxjs';
import { CommonService } from 'src/app/_common/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SpaceService } from './space.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AlertComponent } from 'src/app/_common/components/alert/alert.component';
import { TranslateService } from '@ngx-translate/core';
import { MOCK_DATA } from './mock-data';

@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss']
})
export class SpaceComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  public role: any;
  public currentSpace: any;
  public displayedColumns: string[];
  public dataSource: MatTableDataSource<any>;
  public selection: SelectionModel<any>;
  public pageEvent: PageEvent;
  public tableParams = {
    pageIndex: 0,
    pageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
    orderBy: 'updated_on',
    order: 'desc',
    filterContent: '',
    numOfAll: 0
  };
  private subscriptions: Subscription;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private commonService: CommonService,
    private spaceService: SpaceService,
    private translate: TranslateService,
    private detecRef: ChangeDetectorRef
  ) {
    this.getSnapshotParams();
  }

  public ngOnInit() {
    this.role = this.commonService.getCurrentUserInfos() ? this.commonService.getCurrentUserInfos().role : null;
    this.currentSpace = this.commonService.getCurrentSpace() ?
      this.commonService.getCurrentSpace() : { 'space_name': this.translate.instant('SPACE_SELECTION') };

    this.subscriptions = new Subscription();
    this.dataSource = new MatTableDataSource();
    this.selection = new SelectionModel(true, []);
    this.displayedColumns = ['select', 'space_name', 'snmp',
      'device_num', 'session_num', 'user_num', 'updated_on', 'detail'];

    this.getSpaces();
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
        this.getSpaces();
      });
    // paginator
    this.paginator.page.subscribe((page: PageEvent) => {
      this.tableParams.pageIndex = page.pageIndex;
      this.tableParams.pageSize = page.pageSize;
      this.getSpaces();
    });
    // sort
    this.sort.sortChange.subscribe(() => {
      this.tableParams.pageIndex = 0;
      if (!this.sort.direction) {
        this.sort.direction = 'asc';
      }
      this.tableParams.orderBy = this.sort.active;
      this.tableParams.order = this.sort.direction;
      this.getSpaces();
    });
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public openDetail(spaceId: string) {
    this.router.navigate(['index/space/space-detail'], {
      queryParams: {
        id: spaceId,
        param: this.spliceParams()
      }
    });
  }

  public openCreate() {
    this.router.navigate(['index/space/space-action']);
  }

  public openEdit() {
    if (this.selection.selected) {
      const row = this.selection.selected[0];
      this.router.navigate(['index/space/space-action'], {
        queryParams: {
          id: row.id,
          param: this.spliceParams()
        }
      });
    }
  }

  public openDelete() {
    let delMsg = this.selection.selected[0].space_name;
    if (this.selection.selected.length > 1) {
      delMsg = delMsg + ` ${this.translate.instant('SPACE_DELETE_MSG', { number: this.selection.selected.length })}`;
    } else {
      delMsg = `Space ${delMsg}`;
    }
    const dialogRef = this.dialog.open(AlertComponent, {
      disableClose: true,
      width: '20%',
      data: {
        alertContent: `${delMsg}`
      }
    });
    dialogRef.afterClosed().subscribe(status => {
      if (status) {
        this.commonService.showLoader();
        const idList = [];
        this.selection.selected.forEach(space => {
          idList.push(space.id);
        });
        // this.spaceService.deleteSpaces({ 'id_list': idList }).subscribe((res: any) => {
        //   this.getSpaces();
        //   this.setHeaderSpaceList();
        //   this.commonService.showNewMessage(true, [this.translate.instant('COMMON_USED_LABEL_SUCCESS')]);
        // });
      }
    });
  }

  public openSpaceUser(space: any) {
    this.router.navigate(['index/space/space-user'], {
      queryParams: {
        id: space.id,
        name: space.space_name,
        param: this.spliceParams()
      },
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

  public getSpaces() {
    this.commonService.showLoader();
    // this.subscriptions.add(this.spaceService.getSpaceList(this.tableParams).subscribe(res => {
    //   this.commonService.hideLoader();

    //   this.dataSource.data = res.data.data_list || [];
    //   if (this.dataSource.data.length === 0 && this.tableParams.pageIndex > 0) {
    //     this.tableParams.pageIndex = this.tableParams.pageIndex - 1;
    //     this.getSpaces();
    //   }
    //   this.tableParams.numOfAll = res.data.num_of_all;
    //   this.selection.clear();
    // }));
  }

  private setHeaderSpaceList() {
    this.spaceService.setSpaceList();
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
      this.router.navigate(['index/space']);
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
