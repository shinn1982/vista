import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/_common/services/httpService';
import { Subject, Observable } from 'rxjs';

import * as _ from 'lodash';

const TREE_TYPE_DIC = {
  'root': 'Network',
  'as_num': 'BGP AS',
  'protocol_id': '',
  'instances_id': 'Instance ',
  'area_id': 'Area ',
};

const TREE_LEVEL_DIC = {
  'root': 1,
  'as_num': 2,
  'protocol_id': 3,
  'instances_id': 4,
  'area_id': 5,
};
const PROTOCOLS_DIC = {
  1: 'IS-IS Level 1',
  2: 'IS-IS Level 2',
  3: 'OSPFv2',
  4: 'Direct',
  5: 'Static Configuration',
  6: 'OSPFv3'
};


@Injectable({
  providedIn: 'root'
})
export class TopoPathService {
  public treeData: any;
  public pathData: any;
  public currentPathNode: Subject<any> = new Subject();
  // path点击时触发
  public clickedNodeChanged: Subject<any> = new Subject();
  // 监听最新路径
  public latestPathChanged: Subject<any> = new Subject();

  constructor(private http: HttpService) { }

  public latestPathSend(data: any) {
    this.latestPathChanged.next(data);
  }

  public pathFormat(data: any[]) {
    if (!data.length) {
      data = [{ order: 1, type: 'root', value: null }];
    }
    data.map(item => {
      item.order = TREE_LEVEL_DIC[item.type];
      if (item.type === 'protocol_id') {
        item.displayed_value = PROTOCOLS_DIC[item.value];
      } else {
        item.displayed_value = item.value;
      }
      item.name = TREE_TYPE_DIC[item.type] + (item.value ? item.displayed_value : '');
    });
    data = _.sortBy(data, ['order']);
    return data;
  }

  public getLatestPath(userId: string, spaceId: string): Observable<any> {
    const url = `/topology/linkstate/tree/layout?user_id=${userId}&space_id=${spaceId}`;
    return this.http.get(url);
  }

  public checkPath(path: any, summary: any): any {
    const foundPath = { root: null };
    if (path) {
      let keys = Object.keys(path);
      let result = summary;
      keys = _.sortBy(keys, ['as_num', 'protocol_id', 'instances_id', 'area_id']);
      for (const key of keys) {
        result = _.filter(result, item => item[key] === path[key]);
        if (!result.length) {
          break;
        }
        foundPath[key] = path[key];
      }
    }
    return foundPath;
  }

  public formatPathToTree(path: any, summaryTree: any[]) {
    let result = [];
    const keys = Object.keys(path);
    for (const key of keys) {
      result.push({ 'type': key, 'value': path[key] });
    }

    // 处理成和summar_tree一样的结构
    _.each(result, (item, index) => {
      item.order = TREE_LEVEL_DIC[item.type];
      if (item.type === 'protocol_id') {
        item.displayed_value = PROTOCOLS_DIC[item.value];
      } else {
        item.displayed_value = item.value;
      }
      item.name = TREE_TYPE_DIC[item.type] + (item.value !== null ? item.displayed_value : '');
      let findObj = null;
      if (item.type === 'root') {
        findObj = _.find(summaryTree, s => s.type === item.type && s.value === item.value);
      } else {
        findObj = _.find(summaryTree, s => s.type === item.type && s.value === item.value && s.parent_id === item.parent_id);
      }
      if (findObj) {
        item.id = findObj.id;
        item.parent_id = findObj.parent_id;
        if (result[index + 1]) {
          result[index + 1].parent_id = item.id;
        }
      }
    });
    result = _.sortBy(result, ['order']);
    return result;
  }

  /**
   * 添加node到path上
   * @param focusedNode 要添加的node
   * @param path 原有path
   */
  public addPathNode(focusedNode: any, path: any[]) {
    const lastNode = path[path.length - 1];
    if (lastNode.type === 'area' || lastNode.id === focusedNode.id) { return; }
    const isExist = path.find(item => item.id === focusedNode.id);
    if (isExist) { return; }
    path.push(focusedNode);
    this.latestPathChanged.next(path);
  }

  /**
   * 更改path
   * @param node tree选择的node
   * @param path 原有path
   */
  public changePath(node: any, path: any[]) {
    const index = _.findIndex(path, (item) => item.id === node.id);
    if (index > -1) {
      path.splice(index + 1);
    } else {
      path.push(node);
    }
  }

  public filterTreeNodes(parentNode: any, treeNodes: any) {
    // 先找到这个节点
    const theNode = treeNodes.find((item: any) => item.id === parentNode.id);
    if (!theNode) {
      return null;
    }
    let list = [theNode];
    // 找到之后，找它的children
    const children = _.filter(treeNodes, (item) => item.parentId === parentNode.id);
    // 找parent
    list = [...list, ...children];
    if (theNode.parentId) {
      const parents = this.findParents(theNode, treeNodes);
      // list = [...list, ...parents];
      list = list.concat(children, parents);

    }
  }

  public recurse(nodes: any, path: any): any {
    return _.map(nodes, (node) => {
      const newPath = _.union(path, [node.name]);
      const children = _.omit(node, 'children');
      const destObj = {
        pathname: newPath.join(' > '), level: path.length
      };
      return [
        _.assign(destObj, children),
        this.recurse(node.children, newPath)
      ];
    });
  }

  public flattenTree(tree: any): any {
    const a = this.recurse(tree, []);
    return _.flattenDeep(a);
  }

  /**
   * find parent
   * @param curNode 当前节点
   * @param list tree list data
   */
  public findParent(curNode: any, list: any): any {
    return _.find(list, item => item.id === curNode.parentId);
  }

  public findParents(curNode: any, list: any, parents = []): any {
    parents = parents || [];
    const parentNode = this.findParent(curNode, list);
    if (parentNode) {
      parents.push(parentNode);
    }
    if (parentNode.parentId) {
      this.findParents(parentNode, list, parents);
    }
    return parents;
  }

  /**
   * create a tree struction
   * @param data server response data
   */
  public createTree(data: any, lastNode: any): any {
    const tree = [];
    const copyData = _.cloneDeep(data);
    _.each(copyData, item => {
      if (item.parentId === lastNode.id) {
        item.isExpanded = false;
      } else {
        item.isExpanded = true;
      }
      const parent = this.findParent(item, copyData);
      if (!parent) {
        item.level = 1; // 层级
        tree.push(item); // root node
      } else {
        if (!parent.children) {
          parent.children = [];
        }
        item.level = parent.level + 1;
        parent.children = [...parent.children, ...[item]];
        console.log('children', parent.children);
      }
    });
    return tree;
  }

  public getLastNodeOfPath(path: any) {
    return path.find((item: any) => {
      const children = path.filter((node: any) => node.parentId === item.id);
      if (!children || children.length === 0) {
        return item;
      }
    });
  }

  public filterNetworkSourceByPath(lastPathNode: any, fullNodes: any): any[] {
    let result = _.cloneDeep(fullNodes);
    result = result.filter((item: any) => item.id === lastPathNode.id || item.id === lastPathNode.parentId ||
      item.parentId === lastPathNode.id);
    return result;
  }

  /**
   * path 是否在area 以上
   * @param path 当前网络路径
   */
  public isPathAboveArea(path: any[]): boolean {
    const findArea = path.filter(item => item.type === 'area');
    if (findArea && findArea.length > 0) {
      return false;
    }
    return true;
  }

  public savePath(path: any): Observable<any> {
    const url = `/topology/linkstate/tree/layout`;
    return this.http.post(url, path);
  }
}
