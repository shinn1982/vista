import {
  Component, OnInit, Output, EventEmitter, ViewChild, ChangeDetectorRef,
  AfterViewChecked, AfterViewInit, OnDestroy
} from '@angular/core';
import { MatTableDataSource, PageEvent, MatPaginator, MatSort, MatSlideToggle, MatSlideToggleChange } from '@angular/material';
import { Subscription, Subject } from 'rxjs';
import { CommonService } from 'src/app/_common/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { PathService } from '../services/path.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PolicyCommonService } from '../services/policy-common.service';
import * as _ from 'lodash';
import { MOCK_GET_PATH } from '../mocks/path-data';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-path-table',
  templateUrl: './path-table.component.html',
  styleUrls: ['./path-table.component.scss']
})
export class PathTableComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  public snapshot: string;
  public userId: string;
  public displayedColumns: string[];
  public dataSource: MatTableDataSource<any>;
  public selection: SelectionModel<any>;
  public pageEvent: PageEvent;
  public tableParams = {
    pageIndex: 0,
    pageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
    orderBy: 'headend',
    order: 'asc',
    numOfAll: 0,
    filter: ''
  };
  public headerFilter = {
    headend: '',
    color: '',
    tailend: '',
    administrative_up: '',
    operational_up: ''
  };
  public nodeFilter = {
    param: '',
    type: '',
    displayName: ''
  };
  public flgs = {
    autoRefresh: false,
    showHeaderFilter: false
  };
  private refreshTimeout: any;  // auto refresh
  private refreshInterval = 60000; // 1min
  private subscriptions: Subscription;
  private headerFilterChanged: Subject<any> = new Subject<any>();
  @ViewChild(MatSlideToggle, { static: true }) refreshToggle: MatSlideToggle;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Output() openPathDetailEvent = new EventEmitter<any>();
  @Output() openPathCreateEvent = new EventEmitter<any>();

  constructor(
    private pathService: PathService,
    private commonService: CommonService,
    private policyCommonService: PolicyCommonService,
    private translate: TranslateService,
    private detecRef: ChangeDetectorRef
  ) { }

  public ngOnInit() {
    this.subscriptions = new Subscription();
    this.dataSource = new MatTableDataSource();
    this.selection = new SelectionModel(true, []);
    this.displayedColumns = [
      'select', 'id', 'headend', 'tailend', 'metric', 'bandwidth', 'affinity', 'qos_class', 'priority', 'options'
    ];
    // this.snapshot = this.commonService.getCurrentSnapshot();
    // this.userId = this.commonService.getCurrentUserInfos().user_id;
    this.getData();
  }

  public ngAfterViewInit() {
    // this.refreshToggle.change.subscribe((event: MatSlideToggleChange) => {
    //   this.flgs.autoRefresh = event.checked;
    //   if (event.checked) {
    //     this.timeoutRefresh();
    //   } else {
    //     this.stopAutoRefresh();
    //   }
    // });
    this.paginator.page.subscribe((page: PageEvent) => {
      this.tableParams.pageIndex = page.pageIndex;
      this.tableParams.pageSize = page.pageSize;
      this.getData();
    });
    this.sort.sortChange.subscribe(() => {
      this.tableParams.pageIndex = 0;
      if (!this.sort.direction) {
        this.sort.direction = 'asc';
      }
      this.tableParams.orderBy = this.sort.active;
      this.tableParams.order = this.sort.direction;
      this.getData();
    });
    this.headerFilterChanged.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.getData();
      });

    // trigger when topo selected node and click context menu to filter
    this.subscriptions.add(this.pathService.filterNode.subscribe((node) => {
      this.filterByNode(node);
    }));

    this.subscriptions.add(this.pathService.closeControlPanel.subscribe(() => {
      this.selection.clear();
      this.pathService.clearAllPathSub.next();
    }));

    this.subscriptions.add(this.pathService.afterPathSaved.subscribe(() => {
      this.selection.clear();
      this.pathService.clearAllPathSub.next();

      this.getData();
    }));
  }

  public ngAfterViewChecked() {
    this.detecRef.detectChanges();
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.stopAutoRefresh();
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
    if (this.isAllSelected()) {
      this.selection.clear();
      this.pathService.clearAllPathSub.next();
    } else {
      this.dataSource.data.forEach(row => {
        if (!this.selection.isSelected(row)) {
          this.clickRow(row);
        }
        this.selection.select(row);
      });
    }
  }

  public clickRow(row: any) {
    if (this.selection.isSelected(row)) {
      this.selection.deselect(row);
      this.pathService.pathCruveSub.next({
        type: 'remove',
        name: row.id
      });
    } else {
      this.selection.select(row);
      _.each(row.path, (p: any, i: number) => {
        this.pathService.pathCruveSub.next({
          type: 'add',
          name: row.id,
          path: p,
          uniq: false,
          multiPath: i > 0 ? true : false
        });
      });
    }
  }

  public openCreate(ev: any, currentPath?: any) {
    ev.stopPropagation();
    this.openPathCreateEvent.emit(currentPath);
  }

  public openDetail(ev: any, currentPath: any) {
    // 阻止事件冒泡，阻止默认选中该行
    ev.stopPropagation();
    this.openPathDetailEvent.emit(currentPath);
  }

  // delete one path
  public openDelete(ev: any, currentPath: any) {
    ev.stopPropagation();
    const ids = [];
    ids.push(currentPath._id);

    this.subscriptions.add(this.pathService.delete(this.snapshot, ids).subscribe((res: any) => {
      console.log('deletePath->res:', res);
      if (res.error) {
        this.commonService.showNewMessage(false, [res.info.usr_err_mess]);
        return;
      }
      this.pathService.clearAllPathSub.next();
      this.getData();
    }));
  }

  public refresh() {
    this.stopAutoRefresh();
    this.getData();
    if (this.flgs.autoRefresh) {
      this.timeoutRefresh();
    }
  }

  public headerFilterChange(value: string) {
    this.headerFilterChanged.next(value);
  }

  public clearNodeFilter() {
    this.nodeFilter.param = '';
    this.getData();
  }

  public getData() {
    this.policyCommonService.showLoader();

    this.tableParams.filter = this.getHeaderFilter() + this.nodeFilter.param;
    this.subscriptions.add(this.pathService.getList(this.tableParams, this.snapshot).subscribe((res: any) => {
      console.log('path-table->getData:', res);
      this.policyCommonService.hideLoader();
      if (!res.error) {
        this.dataSource.data = res.data.data_list || [];
        if (this.dataSource.data.length === 0 && this.tableParams.pageIndex > 0) {
          this.tableParams.pageIndex = this.tableParams.pageIndex - 1;
          this.getData();
        }
        this.tableParams.numOfAll = res.data.num_of_all;
      } else {
        this.commonService.showNewMessage(false, [res.info.usr_err_mess]);
      }
      this.selection.clear();
    }));
  }

  private timeoutRefresh() {
    this.refreshTimeout = setInterval(() => {
      this.getData();
    }, this.refreshInterval);
  }

  private stopAutoRefresh() {
    clearInterval(this.refreshTimeout);
    this.refreshTimeout = null;
  }

  private getHeaderFilter() {
    const filter = `${this.headerFilter.headend ? `&headend=${this.headerFilter.headend}` : ''}` +
      `${this.headerFilter.color ? `&color=${this.headerFilter.color}` : ''}` +
      `${this.headerFilter.tailend ? `&tailend=${this.headerFilter.tailend}` : ''}` +
      `${this.headerFilter.administrative_up ? `&administrative_up=${this.headerFilter.administrative_up}` : ''}` +
      `${this.headerFilter.operational_up ? `&operational_up=${this.headerFilter.operational_up}` : ''}`;
    return filter ? `&fuzzy_query=true${filter}` : '';
  }

  private filterByNode(node: any) {
    this.nodeFilter.type = node.filterType;
    this.nodeFilter.displayName = node.display_name;
    if (node.filterType === 'headend') {
      this.nodeFilter.param = `&headend_telemetry_ip=${node.telemetry_ip}` +
        `&precise_query_field=headend_telemetry_ip`;
    } else if (node.filterType === 'tailend') {
      const prefixIpList = node.prefix_ip_list.join(',');
      this.nodeFilter.param = `&tailend_ip=${prefixIpList}` +
        `&precise_query_field=tailend_ip`;
    }
    this.getData();
  }

  public deletePath(ev: any) {
    console.log('deletePath:', ev, this.selection);
    const selectRows = this.selection.selected;
    if (selectRows.length === 0) {
      return;
    }
    const ids = [];
    _.each(selectRows, (row: any) => {
      ids.push(row._id);
    });

    this.subscriptions.add(this.pathService.delete(this.snapshot, ids).subscribe((res: any) => {
      console.log('deletePath->res:', res);
      if (res.error) {
        this.commonService.showNewMessage(false, [res.info.usr_err_mess]);
        return;
      }
      this.pathService.clearAllPathSub.next();
      this.getData();
    }));
  }

  public disableBtnDelete() {
    if (!this.dataSource || this.dataSource.data.length === 0 ||
      !this.selection || !this.selection.selected || this.selection.selected.length === 0) {
      return true;
    }
    return false;
  }

}
