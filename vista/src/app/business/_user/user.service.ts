import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/_common/services/httpService';
import { HomeModule } from 'src/app/_core/home/home.module';
import { CommonService } from 'src/app/_common/services/common.service';

@Injectable({
  providedIn: HomeModule,
})
export class UserService {

  constructor(
    private http: HttpService,
    private commonService: CommonService
  ) { }

  public getUserList(params: any) {
    const url = `/users?current_page=${params.pageIndex + 1}&num_per_page=${params.pageSize}` +
      `&order_by=${params.orderBy}&order=${params.order.toUpperCase()}` +
      `${params.filterContent ? `&obscure=${this.commonService.format(params.filterContent)}` : ''}`;

    return this.http.get(url);
  }

  public createUser(data: any) {
    const url = '/users';
    return this.http.post(url, data);
  }

  public updateUser(data: any) {
    const url = '/users';
    return this.http.put(url, data);
  }

  public deleteUsers(data: any) {
    const url = '/users';
    return this.http.delete(url, data);
  }

  public getUserDetail(userId: string) {
    const url = `/users?id=${userId}`;
    return this.http.get(url);
  }

  public getUserSpace(userId: string) {
    const url = `/user_space?user_id=${userId}`;
    return this.http.get(url);
  }

  public checkNameRepeat(name: string) {
    const url = `/users?username=${name}`;
    return this.http.get(url);
  }

  /**
   * get users without paginator
   * @param value value of search
   */
  public getUsers(value: string) {
    const url = `/users?vague=${value}&username=${value}`;
    return this.http.get(url);
  }
}

/* tslint:disable: variable-name */
export class UserDetailModel {
  username = '';
  alias = '';
  phone_number = '';
  email = '';
  description = '';
  created_on = '';
  visited_on = '';
  updated_on = '';
}

export class UserFormModel {
  id = null;
  username = null;
  alias = null;
  password = null;
  repassword = null;
  phone_number = null;
  email = null;
  description = null;

  constructor(data: any, id?: string) {
    if (id) {
      this.id = id;
    } else {
      delete this.id;
    }
    this.username = data.usernameCtrl;
    this.alias = data.aliasCtrl;
    this.password = data.passwordInfo.passwordCtrl;
    this.repassword = data.passwordInfo.rePasswordCtrl;
    this.phone_number = data.phoneNumberCtrl;
    this.email = data.emailCtrl;
    this.description = data.descriptionCtrl;
  }
}
