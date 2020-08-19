import { Component, OnInit, Input, ViewChild, OnChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { TooltipPosition } from '@angular/material';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { SelectCommonComponent } from 'src/app/_common/components/choosenSelect/selectcommon.component';
import { CommonService } from 'src/app/_common/services/common.service';
import { Router } from '@angular/router';
import { TopoTreeService } from '../services/topo-tree.service';
import { TopoService } from '../services/topo.service';
import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

@Component({
  selector: 'app-topo-sidebar',
  templateUrl: './topo-sidebar.component.html',
  styleUrls: ['./topo-sidebar.component.scss']
})
export class TopoSidebarComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {


  public searchTxt = '';

  public flags = {
    showFilter: false,
  };
  public sortOptions = {
    sortKey: 'display_name', // display_name || node_ip
    sortOrder: 'asc' // asc || desc
  };

  public nodeList: any[] = []; // node data bind to tree
  public toolTipPosition: TooltipPosition = 'below';

  public config: PerfectScrollbarConfigInterface = {};


  private subscriptions: Subscription;

  @Input() topoData: any;
  @ViewChild(SelectCommonComponent, { static: true }) selectInsList: any;
  @ViewChild('filterDiv', { static: true }) filterDiv: any;
  constructor(
    private commonService: CommonService,
    private topoService: TopoService,
    private topoTreeService: TopoTreeService,
    private translate: TranslateService
  ) { }

  public ngOnInit() {
    this.subscriptions = new Subscription();
    this.nodeList = this.formatNodeList(this.topoData.nodes);
    console.log('oninit:', this.nodeList);

  }

  public ngOnChanges(changes: any) {

  }

  public ngAfterViewInit() {
    // this.subscriptions.add(
    //   fromEvent(window, 'resize').pipe(debounceTime(100)).subscribe(() => {
    //     this.setTreeContentHeight();
    //   })
    // );
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }


  private formatNodeList(nodes: any) {
    return _.map(nodes, (node: any) => {
      return {
        id: node.id,
        ip: node.ip,
        display_name: node.id,
      };
    });
  }

  public sortByKey(key: any) {
    this.sortOptions.sortKey = key;
    this.sortOptions.sortOrder = this.sortOptions.sortOrder === 'asc' ? 'desc' : 'asc';
    this.nodeList = _.orderBy(this.nodeList, [key], ([this.sortOptions.sortOrder] as _.Many<boolean | 'asc' | 'desc'>));
  }

  public searchNode() {
    if (!this.searchTxt || this.searchTxt === '') {
      _.each(this.nodeList, (node: any) => {
        node.visible = true;
      });
    } else {
      _.each(this.nodeList, (node: any) => {

        if (node.display_name && node.display_name.indexOf(this.searchTxt) > -1) {
          node.visible = true;
        } else if (node.ip && node.ip.indexOf(this.searchTxt) > -1) {
          node.visible = true;
        } else {
          node.visible = false;
        }
      });
    }

  }

  /**
   * onTreeNodeClick
   * @param node node
   */
  public onTreeNodeClick(node: any) {
    _.each(this.nodeList, (n: any) => {
      if (n.id !== node.id) {
        n.active = false;
      }
    });
    node.active = true;

    this.topoTreeService.selectedNodesChanged.next(node);
  }


  // public setTreeContentHeight() {
  //   const HOST_PADDING = 0;
  //   const ACCORDION_TITLE_HEIGHT = 24;
  //   const ACCORDION_MARGIN = 16;
  //   // const TREE_ACTION_HEIGHT = 22;
  //   const TREE_ACTION_HEIGHT = 24;
  //   // const TREE_PADDING = 10;
  //   const TREE_PADDING = 12;
  //   const TREE_SORT = 0;
  //   const HOST_EL = document.getElementById('sidebar');
  //   let HOST_HEIGHT = 0;
  //   if (HOST_EL) {
  //     HOST_HEIGHT = HOST_EL.offsetHeight;
  //   }

  //   const treeOffsetHeight = ACCORDION_TITLE_HEIGHT + ACCORDION_MARGIN + TREE_ACTION_HEIGHT + TREE_PADDING * 2 + TREE_SORT;

  //   let filterDivHeight = ACCORDION_TITLE_HEIGHT;
  //   const filterDiv = document.querySelector('.filterCond');
  //   if (filterDiv && this.flags.showFilter) {
  //     filterDivHeight = filterDiv.clientHeight;
  //   }
  //   this.treeContentHeight = HOST_HEIGHT - HOST_PADDING * 2 - filterDivHeight - treeOffsetHeight;

  // }

  public toggleShowFilter() {
    this.flags.showFilter = !this.flags.showFilter;

  }


  /**
   * Clear the global datas
   */
  public clearData() {
    this.searchTxt = '';
    this.topoTreeService.fitlerTextChanged.next(this.searchTxt);
    this.nodeList = [];
    // this.immutableNodeList = [];
    this.flags.showFilter = false;
  }


}
