import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PROTOCOLS } from 'src/app/_config/app.conf';
import { TREE_TYPE_DIC } from './topo-dics';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class TopoTreeService {

  summaryTreeChanged: Subject<any> = new Subject<any>();
  summaryTree$ = this.summaryTreeChanged.asObservable();
  // 选中area改变时触发
  selectedAreaChanged: Subject<any> = new Subject<any>();
  selectedSummaryChanged: Subject<any> = new Subject<any>();
  selectedNodesChanged: Subject<any> = new Subject<any>();
  fitlerTextChanged: Subject<any> = new Subject<any>();
  // private _fitlerText: string;
  selectionForTreeChanged: Subject<any> = new Subject<any>(); // next from topo

  constructor() { }

  public summaryTreeSend(data: any) {
    this.summaryTreeChanged.next(data);
  }

  public arrayToTree(nodes: any): any[] {
    const treeData = [];
    const copyData = _.cloneDeep(nodes);
    _.each(copyData, item => {
      const parent = this.findParent(item, copyData);
      if (!parent) {
        item.level = 1;
        treeData.push(item); // root node
      } else {
        if (!parent.children) {
          parent.children = [];
        }
        item.isExpanded = false;
        item.level = parent.level + 1;
        parent.children = [...parent.children, ...[item]];

      }
      if (item.type === 'protocol_id') {
        item.displayed_value = PROTOCOLS[item.value];
      } else {
        item.displayed_value = item.value + '';
      }
      item.name = TREE_TYPE_DIC[item.type] + ((item.value !== null) ? item.displayed_value : '');

    });
    console.log('createTree', treeData);
    return treeData;
  }

  /**
   * find parent
   * @param curNode 当前节点
   * @param list tree list data
   */
  public findParent(curNode: any, list: any): any {
    return _.find(list, item => item.id === curNode.parent_id);
  }

  public findAncestors(curNode: any, list: any, parents = []): any {
    parents = parents || [];
    const parentNode = this.findParent(curNode, list);
    if (parentNode) {
      parents.push(parentNode);
    }
    if (parentNode.parent_id) {
      this.findAncestors(parentNode, list, parents);
    }
    return parents;
  }


  public flattenTree(tree: any): any {
    const recurse = (nodes: any, path: any) => {
      return _.map(nodes, (node) => {
        const newPath = _.union(path, [node.name]);
        const children = _.omit(node, 'children');
        const destObj = {
          pathname: newPath.join(' > '), level: path.length
        };
        return [
          _.assign(destObj, children),
          recurse(node.children, newPath)
        ];
      });
    };
    const a = recurse(tree, []);
    return _.flattenDeep(a);
  }
}
