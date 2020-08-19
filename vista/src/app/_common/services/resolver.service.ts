import { Injectable } from '@angular/core';
import { HttpService } from './httpService';
import { CommonService } from './common.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ResolverService {
  constructor(
    public commonService: CommonService,
    public http: HttpService,
    public router: Router
  ) { }

  public resolve() {
    const spaceId =  this.commonService.getCurrentSpaceId();
    this.commonService.indexLoadingTrigger.next(true);
    const url = `/spaces?id=${spaceId}`;
    return this.http.get(url);
  }

}
