import { Component, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material';
import { Subscription, fromEvent } from 'rxjs';

import { CommonService } from '../../_common/services/common.service';
import { TopoService } from './services/topo.service';
import { TopoPathService } from './services/topo-path.service';
import { TopoTreeService } from './services/topo-tree.service';
import { PathService, PathCruveEvent } from './services/path.service';
import { TopoSettingsComponent } from './topo-settings/topo-settings.component';

import * as _ from 'lodash';
import * as moment from 'moment';
import { MOCK_GET_TOPO } from './mocks/topo-data';
import { MOCK_GET_PATH } from './mocks/path-data';
import { TopoNetwork } from './libs/TopoNetwork';
import { TopoCommon } from './libs/TopoCommon';
import { Network } from '../../../assets/libs/network';
import BezierUtil from './libs/bezier-util';

@Component({
  selector: 'app-topology',
  templateUrl: './topology.component.html',
  styleUrls: ['./topology.component.scss'],
})

export class TopologyComponent implements OnInit, AfterViewInit, OnDestroy {

  public flgs = {
    showTopo: true,
    showNoTopo: false,
    showCloud: false,
    showDetail: false,
    showSidebar: false,
    showRightDrawer: true,
    showPolicyTables: true,
    showPolicyDetail: false,

    isSpaceOwner: false,
    doRefreshFlg: false,
    pathloading: false,

    showPathCtrlPanel: false,
    refreshingTopo: false,
    addLinkFlg: false
  };

  public currentSpace: any;
  public spaceId: string;
  public userId: string;
  public filterValue = '';

  public summary: any[] = []; // 五元组列表
  public summaryTree: any[] = []; // tree
  public latestPath: any;
  public currentArea: any;
  public lastNode: any;

  public outdateFlg: any;
  public outdateTime: any;
  public settingsObj: any;
  public refreshTime: string;
  public timeOutList = [];
  public treeSubData: any = {};

  public selectElements: any;
  private tmpSelect: any = { nodes: [], links: [] };

  public viewType: any = 'customView';

  private zipSubction: any;
  private subscriptions: Subscription;
  public eleCounts = {
    nodeCount: 'N/A',
    linkCount: 'N/A'
  };

  public rightDrawerWidth = 800;
  public grabber = false;
  private oldX = 0;
  private minWidth = 650;
  private maxWidth = 1500;
  private showDetails: any = true;

  public CPathViewModel = {
    topoPK: null,
    srPolicyPK: null,
    activeCPath: null,
    curPathVis: null,
    switchPathVisData: {
      forwardingTable: null,
      policyTable: null,
    },
  };

  public topoData: any;
  public selectedNode = [];
  public currentPathList = [];
  public dragFlag = false;
  private topoNetwork: TopoNetwork;
  private network: Network;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private topoService: TopoService,
    private topoPathService: TopoPathService,
    private topoTreeService: TopoTreeService,
    private pathService: PathService,
    private translate: TranslateService,
    private topoCommon: TopoCommon,
    public dialog: MatDialog,
  ) {
    this.subscriptions = new Subscription();
    this.setSidebarMaxWidth();
  }

  public ngOnInit() {
    this.summary = [];

    this.filterValue = undefined;
    this.flgs.pathloading = false;
    this.outdateFlg = false;

    // mock data init
    this.topoService.setInitMockData();

    this.getVistaTopoData();
  }

  public ngAfterViewInit() {
    // this.getSummaryJoin();
    this.setSubscription();

    fromEvent(window, 'resize').subscribe((event) => {
      this.setSidebarMaxWidth();
      if (this.currentPathList.length > 0) {
        setTimeout(() => {
          this.redrawPath();
        }, 0);
      }
    });

    this.pathService.pathCruveSub.subscribe(res => {
      if (res.type === 'add') {
        this.drawPath(res);
      }
      if (res.type === 'remove') {
        this.removePath(res.name);
      }
    });
    this.pathService.clearAllPathSub.subscribe(() => this.clearBezier());
    this.topoService.removeElementSubject.subscribe(res => {
      if (res.type === 'node') {
        this.removeNode(res.data);
      }
      if (res.type === 'link') {
        this.removeLink(res.data);
      }
    });
    this.topoService.redrawLinkSubject.subscribe(res => {
      this.redrawLink(res);
    });
  }

  ngOnDestroy() {
    if (this.zipSubction) {
      this.zipSubction.unsubscribe();
    }
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }

    this.dialog.closeAll();
  }

  // vista start
  public addNode(event?: any) {
    const x = event ? event.distance.x + 60 : _.random(100, 600);
    const y = event ? event.distance.y + 210 : _.random(100, 600);
    const nodes = this.network.getNodeObj();
    // const nodeName = Math.random().toString(36).slice(-8)
    let count = 1;
    while (nodes[`P${_.size(nodes) + count}`]) {
      count++;
    }
    const nodeName = `P${_.size(nodes) + count}`;
    const nodeData = { id: nodeName };
    this.topoService.addNode(nodeData).subscribe(res => {
      if (!res.error) {
        // draw node
        const newNode = {
          name: nodeName,
          image: 'node',
          width: 40,
          height: 40,
          location: { x, y },
          label: true,
          labelContent: `${nodeName}\n`,
          tooltip: false,
          style: {
            color: 0xe91e63,
            width: 15
          },
          rawData: nodeData
        };
        this.topoNetwork.addNode(newNode);
        this.calcCounts('nodeCount', 'add', 1);
        this.topoService.afterNodeSaved.next();
      } else {
        this.commonService.showNewMessage(false, ['添加节点失败']);
      }
    });
  }

  public removeNode(data: any) {
    const nodeListOfPath = _.uniq(_.flattenDeep(_.map(this.currentPathList, (o) => o.path)));
    if (nodeListOfPath.includes(data.id)) {
      this.commonService.showNewMessage(false, [`当前还原路径中包含${data.id}, 无法删除`]);
      return;
    }

    this.topoService.removeNode(data.id).subscribe(res => {
      if (!res.error) {
        const node = this.network.getNodeObj()[data.id];
        if (node) {
          _.each(node.exceptEdgesArray, (link) => {
            setTimeout(() => {
              this.removeLink(link.rawData);
            }, 0);
          });
          this.network.removeElements(node);
          delete this.topoNetwork.sourceNodes[data.id];
          this.calcCounts('nodeCount', 'remove', 1);
        }
      } else {
        this.commonService.showNewMessage(false, ['删除节点失败']);
      }
    });

  }

  public toggleAddLink() {
    this.flgs.addLinkFlg = !this.flgs.addLinkFlg;
    this.selectedNode = [];
  }

  public addLink(preparedData?: any) {
    this.flgs.addLinkFlg = false;

    let linkData: any;
    let newLink: any;

    if (preparedData) {
      linkData = preparedData.rawData;
      newLink = preparedData;
    } else {
      const id = `${this.selectedNode[0]}=>${this.selectedNode[1]}_${Math.random().toString(36).slice(-8)}`;
      linkData = {
        id,
        local: this.selectedNode[0],
        remote: this.selectedNode[1]
      };

      newLink = {
        name: linkData.id,
        local_host: linkData.local,
        remote_host: linkData.remote,
        label: true,
        multiLine: false,
        arrow: 'end',
        startArrowStyle: this.getMultipleLabelStyle(0).lineStyle,
        endArrowStyle: this.getMultipleLabelStyle(0).lineStyle,
        rawData: linkData
      };
    }

    // for demo
    if (`${linkData.local}=>${linkData.remote}` === 'P1=>P9' ||
      `${linkData.local}=>${linkData.remote}` === 'P9=>P1') {
      // update path for sr-path1
      const pathData = this.pathService.getLocalPathList().data.data_list;
      const srPath1 = _.find(pathData, (d) => d.id === 'sr-path1');
      if (srPath1) {
        srPath1.path = [
          ['P1', 'P1-30100', 'P9', 'P9-30006', 'P3']
        ];
        this.pathService.put(srPath1).subscribe(() => {
          this.pathService.afterPathSaved.next();
        });
      }
    }

    this.topoService.addLink(linkData).subscribe(res => {
      if (!res.error) {
        // draw link
        this.topoNetwork.addMultipeColorLine(newLink);
        this.calcCounts('linkCount', 'add', 1);
      } else {
        this.commonService.showNewMessage(false, ['添加链路失败']);
      }
    });
  }

  public removeLink(data: any) {
    this.topoService.removeLink(data.id).subscribe(res => {
      if (!res.error) {
        const links = this.network.getMultipleLines();
        const link = _.find(links, (l) => l.name === data.id);
        if (link) {
          _.remove(link.start.exceptEdgesArray, (o: any) => o.name === data.id);
          _.remove(link.end.exceptEdgesArray, (o: any) => o.name === data.id);
          this.network.removeElements(link);
          delete this.topoNetwork.sourceEdges[data.id];
          this.calcCounts('linkCount', 'remove', 1);
        }

        // for demo
        if (data.id === 'P6-30003') {
          // update path for sr-path1
          const pathData = this.pathService.getLocalPathList().data.data_list;
          const srPath1 = _.find(pathData, (d) => d.id === 'sr-path1');
          if (srPath1) {
            srPath1.path = [
              ['P1', 'P1-30004', 'P8', 'P8-30005', 'P9', 'P9-30006', 'P3']
            ];
            this.pathService.put(srPath1).subscribe(() => {
              this.pathService.afterPathSaved.next();
            });
          }
        }
      } else {
        this.commonService.showNewMessage(false, ['删除链路失败']);
      }
    });

  }

  public redrawLink(data: any) {
    const links = this.network.getMultipleLines();
    const oldLink = _.find(links, (l) => l.name === data.linkId);

    const newData = data.newData;
    const newPreparedData: any = {
      name: newData.id,
      local_host: newData.local,
      remote_host: newData.remote,
      multiLine: oldLink.hasMultiLine ? true : false,
      arrow: 'end',
      label: true,
      labels: [
        {
          content: `BW:${newData.bandwidth}\nDelay:${newData.delay}\nIGP:${newData.igp}`,
          ratio: 1.0,
          style: {
            align: 'center',
            lineHeight: 16,
            fontSize: 12,
            wordWrap: false
          }
        }
      ],
      rawData: newData
    };

    if (oldLink.hasMultiLine) {
      const localUsage = oldLink.leftRatio;
      const remoteUsage = oldLink.rightRatio;
      const startStyle = this.getMultipleLabelStyle(localUsage);
      const endStyle = this.getMultipleLabelStyle(remoteUsage);
      newPreparedData.startLineRatio = localUsage;
      newPreparedData.startLineStyle = startStyle.lineStyle;
      newPreparedData.startArrowStyle = startStyle.lineStyle;
      newPreparedData.endLineRatio = remoteUsage;
      newPreparedData.endLineStyle = endStyle.lineStyle;
      newPreparedData.endArrowStyle = endStyle.lineStyle;
      newPreparedData.labels.push({
        content: `${localUsage * 100}%`,
        ratio: localUsage,
        style: startStyle.labelStyle
      });
      newPreparedData.labels.push({
        content: `${remoteUsage * 100}%`,
        ratio: 2 - remoteUsage,
        style: endStyle.labelStyle
      });
    } else {
      newPreparedData.startArrowStyle = this.getMultipleLabelStyle(0).lineStyle;
      newPreparedData.endArrowStyle = this.getMultipleLabelStyle(0).lineStyle;
    }

    this.removeLink(oldLink.rawData);
    this.addLink(newPreparedData);
  }

  // Plan A flow
  public testFlow() {
    const flowList = [
      {
        name: '4-2',
        local_host: 'P4',
        remote_host: 'P2',
        style: {
          fillColor: 0x3f51b5,
          lineColor: 0x00dcdee2,
          lineWidth: 1.2
        }
      },
      {
        name: '2-5',
        local_host: 'P2',
        remote_host: 'P5',
        style: {
          fillColor: 0x3f51b5,
          lineColor: 0xdcdee2,
          lineWidth: 1.2
        }
      },
      {
        name: '5-6',
        local_host: 'P5',
        remote_host: 'P6',
        style: {
          fillColor: 0x3f51b5,
          lineColor: 0xdcdee2,
          lineWidth: 1.2
        }
      }
    ];
    this.topoNetwork.addDataFlow(flowList);
  }

  public clearFlow() {
    const dataFlowList = this.network.getDataFlow();
    _.each(dataFlowList, (dataFlow) => {
      _.remove(dataFlow.start.exceptEdgesArray, (o: any) => o.name === dataFlow.name);
      _.remove(dataFlow.end.exceptEdgesArray, (o: any) => o.name === dataFlow.name);
      this.network.removeElements(dataFlow);
    });
    this.topoNetwork.sourceFlows = {};
  }

  public clearBezier() {
    // clear path canvas
    const canvasDom = document.getElementById('path-container');
    canvasDom.setAttribute('height', '1080');
    canvasDom.style.display = 'none';
    this.flgs.showPathCtrlPanel = false;

    // clear node mark
    const nodes = this.network.getNodeObj();
    _.each(this.currentPathList, (path) => {
      nodes[path.headend].removeNodeMark('headend');
      nodes[path.tailend].removeNodeMark('tailend');
    });
    this.currentPathList = [];
  }

  public formatPathNode(raw: Array<any>) {
    const nodes = this.network.getNodeObj();
    const res = [];
    _.each(raw, (node) => {
      if (nodes[node]) {
        res.push(node);
      }
    });
    return _.uniq(res);
  }

  public drawPath(event: PathCruveEvent) {
    if (event.uniq) {
      this.clearBezier();
    }
    const path = this.formatPathNode(event.path);
    const nodes = this.network.getNodeObj();

    // const contianCount = _.intersection(path, _.keys(nodes)).length;
    // if (contianCount !== path.length) {
    //   this.commonService.showNewMessage(true, [`拓扑中不包含路径上的所有点，无法还原路径 ${event.name}`]);
    //   return;
    // }

    const points = [];
    _.each(path, (point, i) => {
      if (i === 0) {
        nodes[point].addNodeMark('headend', 'top-left', 32, 45);
      }
      if (i === path.length - 1) {
        nodes[point].addNodeMark('tailend', 'top-left', 32, 45);
      }
      points.push({
        name: point,
        x: nodes[point].x,
        y: nodes[point].y
      });
    });

    let lineColor: any;
    if (event.multiPath) {
      const tmp = _.find(this.currentPathList, (o) => o.name === event.name);
      lineColor = tmp.color;
    } else {
      lineColor = BezierUtil.getCurveColor(this.currentPathList.length, 0.6);
    }

    BezierUtil.drawCruve('path-container', points, lineColor);
    this.currentPathList.push({
      name: event.name ? event.name : _.join(path, ' -> '),
      headend: path[0],
      tailend: path[path.length - 1],
      color: lineColor,
      multiPath: event.multiPath,
      path
    });
    // show ctrl panel
    this.flgs.showPathCtrlPanel = true;
  }

  public removePath(name: string) {
    const nodes = this.network.getNodeObj();
    _.remove(this.currentPathList, (path) => {
      if (path.name === name) {
        nodes[path.headend].removeNodeMark('headend');
        nodes[path.tailend].removeNodeMark('tailend');
      }
      return path.name === name;
    });
    if (this.currentPathList.length === 0) {
      this.clearBezier();
    } else {
      this.redrawPath();
    }
  }

  public redrawPath() {
    const canvasDom = document.getElementById('path-container');
    canvasDom.setAttribute('height', '1080');  // clear canvas
    const nodes = this.network.getNodeObj();

    _.each(this.currentPathList, (pathObj) => {
      const points = [];
      _.each(pathObj.path, (point) => {
        points.push({
          name: point,
          x: nodes[point].x,
          y: nodes[point].y
        });
      });
      BezierUtil.drawCruve('path-container', points, pathObj.color);
    });
  }

  public handleNetworkEvents(type: string) {
    if (type === 'down' && this.currentPathList.length > 0) {
      this.dragFlag = true;
    }
    if (type === 'up' && this.currentPathList.length > 0) {
      this.dragFlag = false;
    }
    if (this.dragFlag && type === 'move') {
      this.redrawPath();
    }
    if (type === 'wheel') {
      setTimeout(() => {
        this.redrawPath();
      }, 0);
    }
  }

  private getVistaTopoData() {
    // get data
    this.commonService.showLoader();
    this.topoService.getTopoData().subscribe(res => {
      setTimeout(() => {
        this.commonService.hideLoader();
      }, 2000);
      if (!res.error) {
        this.topoData = res.data;
        // render topo
        this.renderTopo(this.prepareTopoData(this.topoData));
      }
    });
  }

  private prepareTopoData(data: any) {
    this.eleCounts = {
      nodeCount: 'N/A',
      linkCount: 'N/A'
    };
    const nodes = [];
    const links = [];
    _.each(data.nodes, (node: any) => {
      nodes.push({
        name: node.id,
        image: 'node',
        width: 40,
        height: 40,
        ip: node.ip,
        location: {
          x: node.x_axis || node.x_axis === 0 ? node.x_axis : _.random(100, 600),
          y: node.y_axis || node.y_axis === 0 ? node.y_axis : _.random(100, 600),
        },
        label: true,
        labelContent: `${node.id}\n${node.ip}`,
        tooltip: false,
        style: {
          color: 0x3f51b5,
          width: 15
        },
        rawData: node
      });
    });
    _.each(data.links, (link: any) => {
      const startStyle = this.getMultipleLabelStyle(0.2);
      const endStyle = this.getMultipleLabelStyle(0.6);

      links.push({
        name: link.id,
        local_host: link.local,
        remote_host: link.remote,
        multiLine: true,
        arrow: 'end',
        label: true,
        startLineRatio: 0.2,
        startLineStyle: startStyle.lineStyle,
        startArrowStyle: startStyle.lineStyle,
        endLineRatio: 0.6,
        endLineStyle: endStyle.lineStyle,
        endArrowStyle: endStyle.lineStyle,
        labels: {
          1: {
            content: '20%',
            ratio: 0.2,
            style: startStyle.labelStyle
          },
          2: {
            content: '60%',
            ratio: 2 - 0.6,
            style: endStyle.labelStyle
          },
          3: {
            content: `BW:${link.bandwidth}\nDelay:${link.delay}\nIGP:${link.igp}`,
            ratio: 1.0,
            style: {
              align: 'center',
              lineHeight: 16,
              fontSize: 12,
              wordWrap: false
            }
          },
        },
        rawData: link
      });
    });

    this.calcCounts('nodeCount', 'add', nodes.length);
    this.calcCounts('linkCount', 'add', links.length);
    return { nodes, multipleLine: links };
  }

  private getMultipleLabelStyle(usage: number) {
    const colorMap = {
      green: 0x4caf50,
      yellow: 0xffc107,
      red: 0xf44336,
      gray: 0xdcdee2
    };
    const tmp = usage > 1 ? 2 - usage : usage;
    let color: number;
    if (tmp > 0.85) {
      color = colorMap.red;
    } else if (tmp > 0.5) {
      color = colorMap.yellow;
    } else if (tmp === 0) {
      color = colorMap.gray;
    } else {
      color = colorMap.green;
    }
    return {
      lineStyle: { color, opacity: 1 },
      labelStyle: { fill: color }
    };
  }

  private renderTopo(data: any) {
    const oldTopo = document.getElementById('network_canvas');
    if (oldTopo) {
      oldTopo.remove();
    }
    const iconResource = {
      resources: { name: 'resources', url: '../../../assets/sprite/vistaUI.json' },
    };
    this.topoNetwork = new TopoNetwork('network', this.topoCommon);
    this.network = this.topoNetwork.network;
    this.bindNodeClick();
    this.bindLinkClick();
    this.bindBlankClick();
    this.topoNetwork.setContextMenuCallBack('removeNode', this.removeNode.bind(this));
    // this.topoNetwork.drawNoIconTopology(data);
    this.topoNetwork.drawTopology(data, iconResource);
  }

  /**
   * @param key nodeCount/linkCount
   * @param option add/remove
   */
  private calcCounts(key: string, option: string, num: number) {
    let tmp = this.eleCounts[key] === 'N/A' ? 0 : Number(this.eleCounts[key]);
    if (option === 'add') {
      tmp += num;
    }
    if (option === 'remove') {
      tmp = tmp - num < 0 ? 0 : tmp - num;
    }
    this.eleCounts[key] = tmp + '';
  }

  public refresh() {
    this.topoService.setInitMockData();
    this.getVistaTopoData();
  }
  // vista end

  public setSidebarMaxWidth() {
    this.maxWidth = Math.max(window.innerWidth * window.devicePixelRatio - 380, this.minWidth);
    if (this.rightDrawerWidth > this.maxWidth) {
      this.rightDrawerWidth = this.maxWidth;
    }
  }

  public onMouseDown(event: MouseEvent) {
    this.grabber = true;
    this.oldX = event.clientX;
  }

  @HostListener('document:mousemove', ['$event'])
  public onMouseMove(event: MouseEvent) {
    if (!this.grabber) {
      return;
    }
    const offset = this.oldX - event.clientX;
    if (this.rightDrawerWidth + offset > this.minWidth && this.rightDrawerWidth + offset < this.maxWidth) {
      this.rightDrawerWidth += offset;
      this.oldX = event.clientX;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  public onMouseUp(event: MouseEvent) {
    this.grabber = false;
  }

  private setSubscription() {

    this.subscriptions.add(this.topoTreeService.selectedNodesChanged
      .subscribe((node: any) => { // tree click node or interface and thire sub
        this.network.clearHighlight();
        const allNodes = this.network.getNodeObj();
        const matchNode = _.find(allNodes, (n: any) => n.name === node.id);
        if (matchNode) {
          this.network.setSelectNodes(matchNode);
        }
      }));

    this.subscriptions.add(this.topoTreeService.fitlerTextChanged.subscribe((subData) => {
      this.filterValue = subData ? subData : undefined;
    }));


    // trigger when one sr-policy clicked 监听选中的sr-policy的变化
    this.subscriptions.add(this.pathService.selectedSR.subscribe((selectedSR: any) => {
      if (!selectedSR) {
        this.clearBezier();
        return;
      }
      this.flgs.showPathCtrlPanel = true; // 隐藏设置 隐藏视图切换
    }));

  }

  public autoLayout(id: string) {

  }

  protected sendTreeSubcribtion(clearFlg, multiEles?: any) {
    /**
     * brief:send topo selected element to tree;
     */
    const dataObj = {
      nodes: [],
      links: []
    };
    if (!clearFlg) {
      if (!multiEles) {
        return false;
      }
      for (const perNode of multiEles.nodes) {
        dataObj.nodes.push(perNode.id);
      }
      for (const perLink of multiEles.links) {
        if (perLink.id.indexOf('_') !== -1) {
          const splitTmp = _.split(perLink.id, '_', 2);
          dataObj.links.push(splitTmp[0], splitTmp[1]);
        } else {
          dataObj.links.push(perLink.id);
        }
        const relatedLocalNode = perLink.local_node_id;
        const relatedRemoteNode = perLink.remote_node_id;
        if (dataObj.nodes.indexOf(relatedLocalNode) === -1) {
          dataObj.nodes.push(relatedLocalNode);
        }
        if (dataObj.nodes.indexOf(relatedRemoteNode) === -1) {
          dataObj.nodes.push(relatedRemoteNode);
        }
      }
    }
    this.topoTreeService.selectionForTreeChanged.next(dataObj);
  }

  /**
   * save view (node position)
   * call: click button of 'save view' and 'save as default view'
   */
  public save(isSpaceDefault: boolean): void {

  }


  /**
   * brief: open setting dialog a
   * call html click
   */
  public openSettings() {

    const dialogConf = {
      panelClass: 'topo-setting-dialog-container',
      disableClose: true,
      backdropClass: 'transparent-overlay',
      position: {
        top: '160px',
        left: '65px',
        bottom: '32px'
      },
      // width: '85vw',
      data: {
        parentScope: this,
        settingsObj: this.settingsObj
      }
    };
    const settingsDialogRef = this.dialog.open(TopoSettingsComponent, dialogConf);

    this.subscriptions.add(
      settingsDialogRef.afterClosed().subscribe((returnData) => {
        this.settingsObj = returnData.data;
      })
    );
  }
  // settings end

  //#region Detail
  public showTopoDetail(flg: boolean) {
    this.flgs.showDetail = flg;

    /////////////////////////////////
    // for demo
    if (this.flgs.showDetail) {
      this.flgs.showRightDrawer = false;
      this.flgs.showPolicyTables = true;
      this.flgs.showPolicyDetail = false;
    }
    /////////////////////////////////
  }

  //#endregion

  public toggleSidebar() {
    this.flgs.showSidebar = !this.flgs.showSidebar;
  }

  public resetPositon() {

  }

  //#region vista
  private bindNodeClick() {
    this.topoNetwork.setClickCallBack('node', (node: any) => {
      if (!this.flgs.addLinkFlg) {
        this.tmpSelect.nodes.push(node);
        this.selectElements = {
          nodes: [node],
          links: [],
          flags: {
            singleType: 'node',
          }
        };
        this.showTopoDetail(true);
      } else {
        if (this.selectedNode.includes(node.name)) {
          this.commonService.showNewMessage(false, ['请选择不同的node']);
        } else {
          this.selectedNode.push(node.name);
        }
        if (this.selectedNode.length === 2) {
          this.addLink();
        }
      }
    });
  }

  private bindLinkClick() {
    this.topoNetwork.setClickCallBack('link', (link: any) => {
      this.tmpSelect.links.push(link);
      this.selectElements = {
        nodes: [],
        links: [link],
        flags: {
          singleType: 'link',
        }
      };
      this.showTopoDetail(true);
    });
  }

  private bindBlankClick() {
    this.topoNetwork.setClickCallBack('blank', (type: string) => {
      if (type === 'down') {
        this.tmpSelect = { nodes: [], links: [] };
      }
      if (type === 'up') {
        const flag = this.tmpSelect.nodes.length > 0 || this.tmpSelect.links.length > 0;
        if (!flag) {
          this.topoService.closeTopoDetailSubject.next();
        }
      }
    });
  }

  ////#endregion
}
