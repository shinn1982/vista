import { Injectable } from '@angular/core';
import { HttpService } from '../../../_common/services/httpService';
import { Observable, of, forkJoin, Subject, pipe } from 'rxjs';
import { flatMap, debounceTime } from 'rxjs/operators';
import * as _ from 'lodash';
import { CommonService } from 'src/app/_common/services/common.service';
import { MOCK_GET_TOPO } from '../mocks/topo-data';
import { MOCK_GET_PATH } from '../mocks/path-data';

const API = {
  LINKSTATE_SUMMARY: '/topology/linkstate/summary',
  LINKSTATE_TOPO: '/topology/linkstate/topo',
  LINKSTATE_TOPO_SETTING: '/topology/linkstate/topo/setting',
  LINKSTATE_TOPO_TREE: '/topology/linkstate/tree',
  LINKSTATE_TOPO_NODE: '/topology/linkstate/topo/node',
  LINKSTATE_TOPO_LINK: '/topology/linkstate/topo/link',
  SAVE_TOPO_LAYOUT: '/topology/linkstate/topo/layout',
};
@Injectable({
  providedIn: 'root'
})
export class TopoService {

  public removeElementSubject: Subject<any> = new Subject<any>();
  public closeTopoDetailSubject: Subject<any> = new Subject<any>();
  // trigger after path created or updated
  public afterNodeSaved: Subject<any> = new Subject<any>();
  // trigger after link's local/remote updated
  public redrawLinkSubject: Subject<any> = new Subject<any>();

  constructor(
    private http: HttpService,
  ) { }

  public setInitMockData() {
    localStorage.setItem('topoData', JSON.stringify(MOCK_GET_TOPO));
    localStorage.setItem('pathData', JSON.stringify(MOCK_GET_PATH));
  }

  public getTopoData() {
    const topoData = JSON.parse(localStorage.getItem('topoData'));
    return of(topoData);
  }

  public addNode(node: any) {
    const topoData = JSON.parse(localStorage.getItem('topoData'));
    topoData.data.nodes.push(node);
    localStorage.setItem('topoData', JSON.stringify(topoData));
    return of({
      'status': true,
      'info': {},
      'error': false
    });
  }

  public removeNode(nodeId: string) {
    const topoData = JSON.parse(localStorage.getItem('topoData'));
    _.remove(topoData.data.nodes, (n: any) => n.id === nodeId);
    localStorage.setItem('topoData', JSON.stringify(topoData));
    return of({
      'status': true,
      'info': {},
      'error': false
    });
  }

  public addLink(link: any) {
    const topoData = JSON.parse(localStorage.getItem('topoData'));
    topoData.data.links.push(link);
    localStorage.setItem('topoData', JSON.stringify(topoData));
    return of({
      'status': true,
      'info': {},
      'error': false
    });
  }

  public removeLink(linkId: string) {
    const topoData = JSON.parse(localStorage.getItem('topoData'));
    _.remove(topoData.data.links, (n: any) => n.id === linkId);
    localStorage.setItem('topoData', JSON.stringify(topoData));
    return of({
      'status': true,
      'info': {},
      'error': false
    });
  }
}
