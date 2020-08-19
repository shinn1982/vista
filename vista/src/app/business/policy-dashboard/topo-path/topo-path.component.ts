import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonService } from 'src/app/_common/services/common.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import * as _ from 'lodash';
import { TopoPathService } from '../services/topo-path.service';

@Component({
  selector: 'app-topo-path',
  templateUrl: './topo-path.component.html',
  styleUrls: ['./topo-path.component.scss']
})
export class TopoPathComponent implements OnInit, OnDestroy {

  @Input() spaceId: string;
  @Input() userId: string;
  public displayPath: any[];
  private subscriptions: Subscription;

  constructor(
    private pathService: TopoPathService,
    private commonService: CommonService,
    private router: Router
  ) { }

  public ngOnInit() {
    this.subscriptions = new Subscription();

    this.subscriptions.add(this.pathService.latestPathChanged.subscribe(path => {
      if (path && path.length) {
        this.displayPath = path;
      }
    }));
    this.subscriptions.add(this.pathService.currentPathNode.subscribe(node => {
      // 不存在则添加
      this.pathService.changePath(node, this.displayPath);
      // do save the path
      this.savePath();
    }));
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public onNodeClick(index: number) {
    this.pathService.clickedNodeChanged.next(this.displayPath[index]);
    const len = this.displayPath.length;
    this.displayPath.splice(index + 1, len - index);

    // do save the path
    this.savePath();
  }

  private nextNode(index: number) {
    for (let i = 0; i < this.displayPath.length; i++) {
      this.displayPath[i].active = false;
      if (i === index + 1) {
        this.displayPath[i].visible = true;
        this.displayPath[i].active = true;
      }
    }
  }

  private savePath() {
    const curPath: any = {};
    _.each(this.displayPath, (item) => {
      if (item.type !== 'root') {
        curPath[item.type] = item.value;
      }
    });

    curPath.user_id = this.userId;
    curPath.space_id = this.spaceId;
    this.pathService.savePath(curPath).subscribe(res => {
      if (res.error) {
        this.commonService.showNewMessage(status, [res.info.usr_err_mess]);
      }
    });
  }
}
