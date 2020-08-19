import { Injectable } from '@angular/core';
import { HomeModule } from 'src/app/_core/home/home.module';
import { HttpService } from 'src/app/_common/services/httpService';
import { Observable, of, forkJoin, Subject } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { CommonService } from 'src/app/_common/services/common.service';
import * as _ from 'lodash';
import { COMMON_PATH_NONSPF_ALG_RES } from '../mocks/common-path-nonspf-alg-response';
import { COMMON_PATH_SPF_ALG_RES } from '../mocks/common-path-spf-alg-response';
import { SR_PATH_AUTO_ALG_RES } from '../mocks/sr-path-auto-alg-response';
import { SR_PATH_MANUAL_ALG_RES } from '../mocks/sr-path-manual-alg-response';

@Injectable({
  providedIn: HomeModule
})
export class BodPolicyService {


  constructor(
    private http: HttpService,
    private commonService: CommonService
  ) { }

  public SynchCreateBodPolicy(requestPrams: any): Observable<any> {
    // const url = `/pasta/bod_pasta`;
    // return this.http.post(url, requestPrams);
    console.log('SynchCreateBodPolicy', requestPrams);
    if (requestPrams.sr_policy.path_type === 'common' && requestPrams.global.algorithm[0].algo === 0) {
      return of(COMMON_PATH_SPF_ALG_RES);
    } else if (requestPrams.sr_policy.path_type === 'common' && requestPrams.global.algorithm[0].algo === 1) {
      return of(COMMON_PATH_NONSPF_ALG_RES);
    } else if (requestPrams.sr_policy.path_type === 'sr' && requestPrams.sr_policy.generate_type === 'auto'
      && requestPrams.global.algorithm[0].algo === 0) {
      return of(SR_PATH_AUTO_ALG_RES);
    } else if (requestPrams.sr_policy.path_type === 'sr' && requestPrams.sr_policy.generate_type === 'manual') {
      return of(SR_PATH_MANUAL_ALG_RES);
    }
    return of({
      status: false,
      'error': true,
      'info': {'usr_err_mess': 'cannot get result'},
    });
  }
}


