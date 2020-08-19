import * as _ from 'lodash';
import { Network } from '../../../../assets/libs/network_dev.js';
import { TopoContext } from './TopoContext';
import { TopoCommon } from './TopoCommon';
import { TopoService } from '../services/topo.service';

export class TopoNetwork {
  public network: Network;
  public commonService: TopoCommon;
  public sourceNodes;
  public sourceEdges;
  public sourceGroups;
  public sourceFlows;
  public sourceOthers;
  // label
  public labelStyle = {
    fontSize: 12,
    fontWeight: 'bold',
    align: 'center'
  };
  // tooltip
  public tooltipStyle = {
    'backgroundColor': 'transparent',
    'color': 'black',
    'padding': '5px 20px',
    'border': '2px solid #ebebeb',
    'border-radius': '10px',
    'userSelect': 'none',
  };
  public defaultLineStyle = {
    arrowColor: 0x3099f1,
    lineColor: 0xCCCCCC,
    arrowAngle: 10,
    lineType: 0,
    lineFull: 0,
    lineWidth: 1,
  };
  public defaultMultipleLineStyle = {
    arrowAngle: 30,
    lineColor: 0xdcdee2,
    lineWidth: 0.8,
  };
  public defaultPortChannelStyle = {
    lineColor: 0X0386d2,
    fillColor: 0XFFFFFF,
  };

  private domRegex;
  private nodeClickCallBack: any;
  private linkClickCallBack: any;
  private blankCallBack: any;
  private contextMenuCallBack: any = {};

  private nodeDownPoint: any = {};
  private nodeDownFlg = false;

  constructor(
    domRegex: string,
    commonService: TopoCommon
  ) {
    this.network = new Network(domRegex);
    this.domRegex = domRegex;
    (window as any).topo = this.network;
    this.commonService = commonService;
    this.sourceNodes = {};
    this.sourceEdges = [];
    this.sourceGroups = {};
    this.sourceFlows = {};
    this.sourceOthers = {};
  }

  public setClickCallBack(type: string, func: any) {
    if (type === 'node') {
      this.nodeClickCallBack = func;
    }
    if (type === 'link') {
      this.linkClickCallBack = func;
    }
    if (type === 'blank') {
      this.blankCallBack = func;
    }
  }

  public setContextMenuCallBack(id: string, func: any) {
    this.contextMenuCallBack[id] = func;
  }

  public drawNoIconTopology(topoData) {
    const network = this.network;
    const nodes = topoData.nodes;
    const links = topoData.links;
    const edgeGroups = topoData.edgeGroups;
    const dataFlows = topoData.dataFlows;
    const multipleLine = topoData.multipleLine;
    const portChannel = topoData.portChannel;
    // const groups = topoData.groups;
    // const groupsList = this.commonService.keySort(groups);
    // create Node
    this.initNodesData(nodes);
    // create Links
    this.initEdgesData(links);
    // create group
    // this.initGroupsData(groupsList);
    // create edge group
    this.initEdgeGroupsData(edgeGroups);
    // create data flow
    this.initDataFlowsData(dataFlows);
    // create multiple color line
    this.initMultipleColorLine(multipleLine);
    // create port channel
    this.initPortChannel(portChannel);
    network.syncView();
    network.setDrag();
    network.setZoom();
    network.setClick();
    network.moveCenter();
    network.setBundleExpanded(false);
    network.toggleLabel(1, 2);
    window.addEventListener('resize', () => {
      network.moveCenter();
    });
    this.commonService.changeNetwork(network);
    this.doMouseWheel();
    // window.topo = this.network;
  }

  public drawTopology(topoData, imageData, callbacksecFunction?: any) {
    const network = this.network;
    network.initIconResource(imageData);
    const nodes = topoData.nodes;
    const links = topoData.links;
    const edgeGroups = topoData.edgeGroups;
    const dataFlows = topoData.dataFlows;
    const multipleLine = topoData.multipleLine;
    const portChannel = topoData.portChannel;
    // const groups = topoData.groups;
    // const groupsList = this.commonService.keySort(groups);
    network.callback = () => {
      // create Node
      this.initNodesData(nodes);
      // create Links
      this.initEdgesData(links);
      // create group
      // this.initGroupsData(groupsList);
      // create edge group
      this.initEdgeGroupsData(edgeGroups);
      // create data flow
      this.initDataFlowsData(dataFlows);
      // create multiple color line
      this.initMultipleColorLine(multipleLine);
      // create port channel
      this.initPortChannel(portChannel);
      network.syncView();
      network.setDrag();
      network.setZoom();
      network.setClick();
      network.moveCenter();
      network.setBundleExpanded(false);
      network.toggleLabel(1, 2);
      window.addEventListener('resize', () => {
        // network.moveCenter();
      });
      this.commonService.changeNetwork(network);
      this.commonService.network = network;
      if (callbacksecFunction) {
        callbacksecFunction();
      }
    };
    this.doMouseWheel();
    this.blankClick();
    // window.topo = this.network;
  }

  public addNode(node: any | Array<any>) {
    let newNodes = [];
    if (Array.isArray(node)) {
      newNodes = node;
    } else {
      newNodes.push(node);
    }
    this.initNodesData(newNodes);
    this.network.syncView();
    this.network.setClick();
  }

  public addMultipeColorLine(link: any | Array<any>) {
    let newLinks = [];
    if (Array.isArray(link)) {
      newLinks = link;
    } else {
      newLinks.push(link);
    }
    this.initMultipleColorLine(newLinks);
    this.network.syncView();
    this.network.setClick();
    this.network.zoomNetworkElements(this.network.zoom);
  }

  public addDataFlow(flow: any | Array<any>) {
    let newFlow = [];
    if (Array.isArray(flow)) {
      newFlow = flow;
    } else {
      newFlow.push(flow);
    }
    this.initDataFlowsData(newFlow);
    this.network.syncView();
  }

  public initNodesData(nodes) {
    const that = this;
    const nodesColor = [];
    _.each(nodes, device => {
      const node = that.commonService.newNode(that, device);
      node.rawData = device.rawData;
      node.on('mousedown', (event: any) => {
        this.nodeDownFlg = true;
        this.nodeDownPoint.x = event.data.originalEvent.x;
        this.nodeDownPoint.y = event.data.originalEvent.y;
      });
      node.on('mouseup', (event: any) => {
        const upPoint = {
          x: event.data.originalEvent.x,
          y: event.data.originalEvent.y
        };
        const d = Math.sqrt(
          Math.pow(this.nodeDownPoint.x - upPoint.x, 2) +
          Math.pow(this.nodeDownPoint.y - upPoint.y, 2)
        );
        if (d < 7) {
          this.nodeClickCallBack(device);
        }
        this.nodeDownFlg = false;
      });
      that.initNodeRightClickMenu(node);
      nodesColor.push({
        'name': device.name,
        'color': device.style.color,
      });
      this.sourceNodes[device.name] = node;
    });
    this.commonService.changeNodesColor(nodesColor);
  }

  public initEdgesData(links) {
    const that = this;
    const edgeObjList = [];
    _.each(links, link => {
      const edge = that.commonService.newEdge(that, link);
      // that.initPhysicalEdgeRightClickMenu(edge);
      if (edge) {
        edgeObjList.push(edge);
      }
      this.sourceEdges = edgeObjList;
    });
  }

  public initGroupsData(groupsMap) {
    const groupObjList = [];
    const that = this;
    _.each(groupsMap, (group, groupId) => {
      const newGroup = that.commonService.newGroup(that, group);
      groupObjList.push(newGroup);
      this.sourceGroups[groupId] = newGroup;
      // that.initPhysicalGroupRightClickMenu(newGroup);
    });
    return groupObjList;
  }

  public initEdgeGroupsData(groupsMap) {
    const groupObjList = [];
    const that = this;
    _.each(groupsMap, (group, groupId) => {
      const newGroup = that.commonService.newEdgeGroup(that, group);
      groupObjList.push(newGroup);
      this.sourceGroups[groupId] = newGroup;
      // that.initPhysicalGroupRightClickMenu(newGroup);
    });
    return groupObjList;
  }

  public initDataFlowsData(dataFlows) {
    const flowObjList = [];
    const that = this;
    _.each(dataFlows, (dataFlow) => {
      if (!that.sourceFlows[dataFlow.name]) {
        const newFlow = that.commonService.newDataFlow(that, dataFlow);
        flowObjList.push(newFlow);
        that.sourceFlows[dataFlow.name] = newFlow;
        // that.initPhysicalGroupRightClickMenu(newGroup);
      }
    });
    return flowObjList;
  }

  public initMultipleColorLine(multipleLines) {
    const multipleLineList = [];
    const that = this;
    _.each(multipleLines, (multipleLine) => {
      const newMultipleLine = that.commonService.newMultipleLine(that, multipleLine);
      newMultipleLine.on('mouseup', () => {
        this.linkClickCallBack(multipleLine);
      });
      newMultipleLine.name = multipleLine.name;
      newMultipleLine.rawData = multipleLine.rawData;
      multipleLineList.push(newMultipleLine);
      this.sourceEdges[newMultipleLine.name] = newMultipleLine;
    });
    return multipleLineList;
  }

  public initPortChannel(portChannels) {
    const portChannelList = [];
    const that = this;
    _.each(portChannels, (portChannel, id) => {
      const newPortChannel = that.commonService.newPortChannel(that, portChannel);
      portChannelList.push(newPortChannel);
      this.sourceOthers[id] = newPortChannel;
    });
    return portChannelList;

  }

  public initNodeRightClickMenu(node: Network.Node) {
    const that = this;
    node.on('rightclick', (event: any) => {
      that.network.menu.setMenuItems(TopoContext.nodeRightMenu);
      that.network.menu.menuOnAction = (id: string) => {
        console.log('DEBUG popMenu type: ', id);
        if (id === 'removeNode') {
          this.contextMenuCallBack[id](node.rawData);
        } else if (id === 'nodeDetail') {

        } else if (id === 'filterPathByHeadend') {

        } else if (id === 'filterPathByTailend') {

        } else if (id === 'debug') {
          const nodes = that.network.getNodeObj();
          const links = that.network.getMultipleLines();
          const positionList = [];
          _.each(nodes, (n) => {
            positionList.push({
              name: n.name,
              x: n.x,
              y: n.y,
            });
          });
          console.log('nodes: ', positionList);
        }
      };
      that.network.menu.setClass('popMenu');
      that.network.menu.showMenu(event);
    });
  }

  public doMouseWheel() {
    const body = document.getElementById(this.domRegex);
    const network = this.network;
    body.addEventListener('wheel', () => {
      if (!TopoContext.labelToggle && !TopoContext.edgeLabelToggle) {
        network.toggleLabel(1, 2);
      } else if (TopoContext.labelToggle && !TopoContext.edgeLabelToggle) {
        network.toggleLabel(0, 2);
      } else if (!TopoContext.labelToggle && TopoContext.edgeLabelToggle) {
        network.toggleLabel(1, 0);
      } else if (TopoContext.labelToggle && TopoContext.edgeLabelToggle) {
        network.toggleLabel(0, 0);
      }
    });
  }

  public blankClick() {
    const body = document.getElementById(this.domRegex);
    body.addEventListener('mousedown', () => {
      if (!this.nodeDownFlg) {
        this.blankCallBack('down');
      }
    });
    body.addEventListener('mouseup', () => {
      this.blankCallBack('up');
    });
  }

}
