import { Injectable } from '@angular/core';
import { HomeModule } from 'src/app/_core/home/home.module';
import { HttpService } from 'src/app/_common/services/httpService';
import { Observable, of, forkJoin, Subject } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { CommonService } from 'src/app/_common/services/common.service';
import * as _ from 'lodash';
import { path } from 'd3';

export interface PathCruveEvent {
  type: string;  // add or remove
  name?: string;
  path?: Array<any>;
  uniq?: boolean;  // Whether to clear the existing path
  multiPath?: boolean;
}

@Injectable({
  providedIn: HomeModule
})
export class PathService {

  public currentTopo: any;

  // change when selected node on topology changed
  public filterNode: Subject<any> = new Subject<any>();
  // trigger after path created or updated
  public afterPathSaved: Subject<any> = new Subject<any>();

  public selectedSR: Subject<any> = new Subject<any>();
  public selectedPathVis: Subject<any> = new Subject<any>();
  public closeControlPanel: Subject<any> = new Subject<any>();

  public pathCruveSub: Subject<PathCruveEvent> = new Subject<PathCruveEvent>();
  public clearAllPathSub: Subject<any> = new Subject<any>();

  public PathVisType = {
    Forwarding: 'forwarding',
    Policy: 'policy',
  };

  constructor(
    private http: HttpService,
    private commonService: CommonService
  ) { }

  public setLocalPathList(pathList: any) {
    localStorage.setItem('pathData', JSON.stringify(pathList));
  }

  public getLocalPathList() {
    return JSON.parse(localStorage.getItem('pathData'));
  }

  public getList(tableParams: any, snapshot: string) {
    // const url = `/controller_sr_policies?space_id=${spaceId}` +
    //   `&current_page=${tableParams.pageIndex + 1}` +
    //   `&num_per_page=${tableParams.pageSize}` +
    //   `&order_by=${tableParams.orderBy}` +
    //   `&order=${tableParams.order.toUpperCase()}` +
    //   `${tableParams.filter ? tableParams.filter : ''}`;
    // return this.http.get(url);
    const pageSize = tableParams.pageSize;
    const pathData = JSON.parse(localStorage.getItem('pathData'));
    pathData.data.num_of_all = pathData.data.data_list.length;
    pathData.data.total_page = Math.ceil(pathData.data.num_of_all / pageSize);
    pathData.data.current_page = tableParams.pageIndex + 1;
    return of(pathData);
  }

  public delete(snapshot: string, ids: string[]) {
    const pathData = JSON.parse(localStorage.getItem('pathData'));
    let pathList = pathData.data.data_list || [];
    if (pathList.length === 0) {
      return of({
        'error': true,
        'status': false,
        'info': { usr_err_mess: 'path cannot be found by id' }
      });
    }
    _.each(ids, (id: string) => {
      pathList = this.removeById(pathList, id);
    });
    pathData.num_of_all = pathData.data.data_list.length;
    this.setLocalPathList(pathData);
    return of({
      'error': false,
      'status': true,
      'info': {}
    });
  }

  private removeById(pathList, id) {
    const index = pathList.findIndex((item: any) => item._id === id);
    if (index >= 0) {
      pathList.splice(index, 1);
    }
    return pathList;
  }

  public create(requestParams: any): Observable<any> {
    requestParams._id = this.commonService.uuidv4();
    const pathData = this.getLocalPathList();
    pathData.data.data_list = pathData.data.data_list || [];
    pathData.data.data_list.push(requestParams);

    this.setLocalPathList(pathData);

    return of({
      'error': false,
      'status': true,
      'info': {}
    });
  }

  public put(requestParams: any) {
    const pathData = this.getLocalPathList();
    const list = pathData.data.data_list || [];

    const index = _.findIndex(list, (p: any) => p._id === requestParams._id);
    list[index] = requestParams;

    pathData.data.data_list = list;
    this.setLocalPathList(pathData);

    return of({
      'error': false,
      'status': true,
      'info': {}
    });
  }

  // public getDetailZip(policyInfos: any) {
  //   const commonParams = `?space_id=${policyInfos.spaceId}` +
  //     `&headend_telemetry_ip=${policyInfos.headendTelemetryIp}` +
  //     `&color=${policyInfos.color}` +
  //     `&tailend_ip=${policyInfos.tailendIp}`;
  //   const basicUrl = '/controller_sr_policies' + commonParams;
  //   const cpathUrl = '/controller_c_paths' + commonParams +
  //     `&as_num=${this.currentTopo.as_num}` +
  //     `&protocol_id=${this.currentTopo.protocol_id}` +
  //     `&instances_id=${this.currentTopo.instances_id}` +
  //     `&area_id=${this.currentTopo.area_id}&algorithm=0` +
  //     `&user_id=${this.commonService.getCurrentUserInfos().user_id}`;

  //   const basicDetail: Observable<any> = this.http.get(basicUrl).pipe(flatMap(o => {
  //     o.type = 'basicDetail'; return of(o);
  //   }));
  //   const cpathDetail: Observable<any> = this.http.get(cpathUrl).pipe(flatMap(o => {
  //     o.type = 'cpathDetail'; return of(o);
  //   }));

  //   return forkJoin([basicDetail, cpathDetail]);
  // }


  public filterByNode(spaceId: string, node: any, tableParams: any) {
    let url = `/controller_sr_policies?space_id=${spaceId}`;

    if (node.filterType === 'headend') {
      url += `&headend_telemetry_ip=${node.telemetry_ip}`;
    } else if (node.filterType === 'tailend') {
      const prefixIpList = node.prefix_ip_list.join(',');
      console.log('170 prefixIpList::', prefixIpList);
      url += `&tailend_ip=${prefixIpList}`;
    } else { }
    url += `&current_page=1` +
      `&num_per_page=${tableParams.pageSize}` +
      `&order_by=${tableParams.orderBy}` +
      `&order=${tableParams.order.toUpperCase()}`;
    return this.http.get(url);
  }

}
