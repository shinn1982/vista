import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CommonService } from '../services/common.service';
import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';

import { Router } from '@angular/router';
// 请求类型

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl: any = '/api';
  constructor(private http: HttpClient, private router: Router, private commonService: CommonService) {
  }

  private generageHeader(header: any = null, refresh: boolean = false, body: any = null) {
    const spaceId = this.commonService.getCurrentSpaceId();
    const currentUserObj = this.commonService.getCurrentUserInfos();
    const headerOptions: any = {
      'Content-Type': 'application/json',
      Authorization: ''
    };
    if (currentUserObj) {
      if (refresh) {
        headerOptions.Authorization = `Bearer ${currentUserObj.refresh_token}`;
      } else {
        headerOptions.Authorization = `Bearer ${currentUserObj.access_token}`;
      }
    }
    if (spaceId) {
      headerOptions.space_id = spaceId;
    }
    if (header) {
      for (const key in header) {
        if (header[key]) {
          headerOptions[key] = header[key];
        }
      }
    }
    if (body) {
      return {
        headers: headerOptions,
        body
      };
    }
    return {
      headers: headerOptions
    };
  }
  public get(url: string, header: any = {}, refresh: any = false): Observable<any> {
    const httpOptions = this.generageHeader(header, refresh);
    return this.http.get(`${this.baseUrl}${url}`, httpOptions)
      .pipe(
        map(this.extractData.bind(this)),
        catchError(this.handleError.bind(this))
      );
  }
  public post(url: string, data = {}, header: any = {}, refresh: any = false): Observable<any> {
    const httpOptions = this.generageHeader(header, refresh);
    return this.http.post(`${this.baseUrl}${url}`, data, httpOptions)
      .pipe(
        map(this.extractData.bind(this)),
        catchError(this.handleError.bind(this))
      );
  }

  public put(url: string, data = {}, header: any = {}, refresh: any = false): Observable<any> {
    const httpOptions = this.generageHeader(header, refresh);
    return this.http.put(`${this.baseUrl}${url}`, data, httpOptions)
      .pipe(
        map(this.extractData.bind(this)),
        catchError(this.handleError.bind(this))
      );
  }

  public delete(url: string, data: any = null, header: any = {}, refresh: boolean = false): Observable<{}> {
    const httpOptions = this.generageHeader(header, refresh, data);
    return this.http.delete(`${this.baseUrl}${url}`, httpOptions)
      .pipe(
        map(this.extractData.bind(this)),
        catchError(this.handleError.bind(this))
      );
  }


  private extractData(res: Response) {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): Observable<any> {

    const reg500 = new RegExp(/^5\d{2}$/);
    if (error.status === 401) {

    } else if (reg500.test(error.status.toString()) || error.status === 0) {
      this.router.navigate(['/index/errorpage'], { queryParams: { statusCode: error.status, statusText: error.statusText } });
    }
    const res: any = {
      status: error.status || false,
      info: error.error ? error.error.info : '',
      error: true,
      data: []
    };
    if (error.error && error.error.info && error.error.info.err_code === 2) {
      res.data = error.error.data;
      this.commonService.licenseMsgSubject.next(error.error.info.usr_err_mess);
      this.commonService.setLicenseMsgCode(error.error.info.err_code);
    }
    return of(res);
  }
}
