import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/_common/services/httpService';
import { HomeModule } from 'src/app/_core/home/home.module';
import { CommonService } from 'src/app/_common/services/common.service';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class SpaceService {

  private spaceSource = new Subject<any>();
  private currentSpaceSource = new Subject<any>();
  spaceList$ = this.spaceSource.asObservable();
  currentSpace$ = this.currentSpaceSource.asObservable();

  constructor(
    private http: HttpService,
    private commonService: CommonService
  ) { }

  public getSpaceList(params: any) {
    const url = `/spaces?current_page=${params.pageIndex + 1}&num_per_page=${params.pageSize}` +
      `&order_by=${params.orderBy}&order=${params.order.toUpperCase()}` +
      `${params.filterContent ? `&obscure=${this.commonService.format(params.filterContent)}` : ''}`;

    return this.http.get(url);
  }

  public setSpaceList() {
    const url = '/spaces';
    this.http.get(url).subscribe(res => {
      const spaceList = res.data.data_list;
      this.spaceSource.next(spaceList);
    });
  }

  public sendCurrentSpace(value: any) {
    this.currentSpaceSource.next(value);
  }

  public createSpace(data: any) {
    const url = '/spaces';
    return this.http.post(url, data);
  }

  public updateSpace(data: any) {
    const url = '/spaces';
    return this.http.put(url, data);
  }

  public deleteSpaces(data: any) {
    const url = '/spaces';
    return this.http.delete(url, data);
  }

  public getSpaceDetail(spaceId: string) {
    const url = `/spaces?id=${spaceId}`;
    return this.http.get(url);
  }

  public getSpaceSession(spaceId: string) {
    const url = `/bgp_sessions?space_id=${spaceId}`;
    return this.http.get(url);
  }

  public checkNameRepeat(name: string) {
    const url = `/spaces?space_name=${name}`;
    return this.http.get(url);
  }

  public getAllSpaceUsers(spaceId: string) {
    const url = `/space_user?&space_id=${spaceId}`;
    return this.http.get(url);
  }

  public getSpaceUsers(params: any, spaceId: string) {
    const url = `/space_user?current_page=${params.pageIndex + 1}&num_per_page=${params.pageSize}` +
      `&order_by=${params.orderBy}&order=${params.order.toUpperCase()}` +
      `${params.filterContent ? `&obscure=${this.commonService.format(params.filterContent)}` : ''}` +
      `&space_id=${spaceId}`;
    return this.http.get(url);
  }

  public addUser(data: any) {
    const url = '/space_user';
    return this.http.post(url, data);
  }

  public updateUser(data: any) {
    const url = `/space_user/update`;
    return this.http.put(url, data);
  }

  public deleteUser(data: any) {
    const url = `/space_user`;
    return this.http.delete(url, data);
  }

  public changeSpace(data: any) {
    const url = `/space_user/stat`;
    return this.http.put(url, data);
  }
}

/* tslint:disable: variable-name */
export class SpaceDetailModel {
  space_name = '';
  snmp_community = '';
  created_on = '';
  updated_on = '';
  description = '';
  filter = '';
  space_devices = [];
  node_name_regex_list = [];
}

export class SpaceFormModel {
  id = null;
  space_name = null;
  snmp = null;
  description = null;
  filter = null;
  bandwidth_threshold = null;
  node_name_regex_list = [];

  constructor(data: any, id?: string) {
    if (id) {
      this.id = id;
    } else {
      delete this.id;
    }
    this.space_name = data.spaceNameCtrl;
    this.snmp = data.snmpCtrl;
    this.description = data.descriptionCtrl;
    this.filter = data.filterCtrl;
    this.bandwidth_threshold = data.bandwidthThresholdCtrl;
  }
}
