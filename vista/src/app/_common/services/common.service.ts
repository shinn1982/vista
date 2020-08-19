import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MessageService } from '../components/message/message.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})

export class CommonService {

  public usernameChange = new Subject<any>();
  public loaderSub = new Subject<any>();
  public indexLoadingTrigger = new Subject<any>();
  public licenseMsgCode: number;
  public licenseMsgSubject = new Subject<any>();
  private messageRef: any;
  constructor(private snackBar: MatSnackBar, private messageService: MessageService, private translate: TranslateService) {
    this.indexLoadingTrigger.subscribe((flg) => { // show hide loading tiggerd when common space api getting.
      if (flg) {
        this.showLoader();
      } else {
        this.hideLoader();
      }
    });
  }

  public setAppTitle() {
    document.title = this.translate.instant('APP_TITLE');
    this.translate.onLangChange.subscribe(() => {
      document.title = this.translate.instant('APP_TITLE');
    });
  }

  public setBreadCrumbData(fun: any) {
    this.translate.onLangChange.subscribe(() => {
      // this.setAppTitle();
      fun();
    });
    fun();
  }

  public repeatFormControlErrors(dataList: any, formCtrl: FormControl) {
    const originalErrors = formCtrl.errors;
    const repeatFlg = dataList ? dataList.length > 0 : false;
    let newErrors = null;
    if (originalErrors) {
      originalErrors.nameRepeat = repeatFlg;
      newErrors = originalErrors;
    } else {
      newErrors = repeatFlg ? { nameRepeat: true } : null;
    }
    formCtrl.setErrors(newErrors);
  }

  public format(str): string {
    str = str
      .replace(/\s/g, '%20')
      .replace(/\!/g, '%21')
      .replace(/\"/g, '%22')
      .replace(/\#/g, '%23')
      .replace(/\$/g, '%24')
      .replace(/\%/g, '%25')
      .replace(/\&/g, '%26')
      .replace(/\'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A')
      .replace(/\+/g, '%2B')
      .replace(/\,/g, '%2C')
      .replace(/\-/g, '%2D')
      .replace(/\./g, '%2E')
      .replace(/\//g, '%2F')
      .replace(/\:/g, '%3A')
      .replace(/\;/g, '%3B')
      .replace(/\</g, '%3C')
      .replace(/\=/g, '%3D')
      .replace(/\>/g, '%3E')
      .replace(/\?/g, '%3F')
      .replace(/\@/g, '%40')
      .replace(/\[/g, '%5B')
      .replace(/\\/g, '%5C')
      .replace(/\]/g, '%5D')
      .replace(/\^/g, '%5E')
      .replace(/\_/g, '%5F')
      .replace(/\`/g, '%60')
      .replace(/\{/g, '%7B')
      .replace(/\|/g, '%7C')
      .replace(/\}/g, '%7D')
      .replace(/\~/g, '%7E');
    return str;
  }

  public showNewMessage(status, msgs) {
    this.messageService.add(status, msgs);
  }

  public dismissAllMsg() {
    this.messageService.dismiss();
  }

  public getCurrentUserInfos() {
    const lastLoginUser: any = sessionStorage.getItem('current_user') || localStorage.getItem('lastLoginUser');
    const currentUserObj: any = localStorage.getItem(lastLoginUser) ? JSON.parse(localStorage.getItem(lastLoginUser)) : null;
    return currentUserObj;
  }
  public getCurrentSpace() {
    const currentUserObj: any = this.getCurrentUserInfos();
    const currentSpace: any = currentUserObj && currentUserObj.currentSpace ? currentUserObj.currentSpace : null;
    return currentSpace;
  }
  public getCurrentSpaceId() {
    const currentUserObj: any = this.getCurrentUserInfos();
    const currentSpace: any = currentUserObj && currentUserObj.currentSpace ? currentUserObj.currentSpace : null;
    const spaceId = currentSpace && currentSpace.space_id ? currentSpace.space_id : null;
    return spaceId;
  }
  public getSpaceList() {
    const currentUserObj: any = this.getCurrentUserInfos();
    const spaceList = currentUserObj && currentUserObj.space_list ? currentUserObj.space_list : [];
    return spaceList;
  }
  public setSpaceList(spaceList: any) {
    const currentUserObj: any = this.getCurrentUserInfos();
    currentUserObj.space_list = spaceList;
    localStorage.setItem(currentUserObj.user_id, JSON.stringify(currentUserObj));
  }
  public setCurrentSpace(currentSpace: any) {
    const currentUserObj: any = this.getCurrentUserInfos();
    currentUserObj.currentSpace = currentSpace;
    localStorage.setItem(currentUserObj.user_id, JSON.stringify(currentUserObj));
  }
  public setRole(role: any) {
    const currentUserObj: any = this.getCurrentUserInfos();
    currentUserObj.role = role;
    localStorage.setItem(currentUserObj.user_id, JSON.stringify(currentUserObj));
  }

  public setToken(token) {
    const currentUserObj: any = this.getCurrentUserInfos();
    currentUserObj.access_token = token;
    localStorage.setItem(currentUserObj.user_id, JSON.stringify(currentUserObj));
  }
  public setNewUsername(value: string) {
    const currentUserObj: any = this.getCurrentUserInfos();
    currentUserObj.username = value;
    localStorage.setItem(currentUserObj.user_id, JSON.stringify(currentUserObj));
    this.usernameChange.next(true);
  }

  public showLoader() {
    this.loaderSub.next(true);
  }

  public hideLoader() {
    this.loaderSub.next(false);
  }

  public setLicenseMsgCode(code: number) {
    this.licenseMsgCode = code ? code : null;
  }

  public getLicenseMsgCode() {
    return this.licenseMsgCode;
  }

  public ipSort(ipAddressArray: any[], key: string) {
    const result = ipAddressArray.sort((a, b) => {
      a = a[key];
      b = b[key];
      if (!a || !b) {
        return 0;
      }
      if (a.indexOf('/') > -1) {
        a = a.substring(0, a.indexOf('/'));
        b = b.substring(0, b.indexOf('/'));
      }
      a = a.split('.');
      b = b.split('.');
      for (let i = 0; i < a.length; i++) {
        const ai = parseInt(a[i], 10);
        const bi = parseInt(b[i], 10);
        if (ai < bi) {
          return -1;
        } else if (ai > bi) {
          return 1;
        }
      }
      return 0;
    });
    return result;
  }

  public uuidv4() {
    return `${this.S4()}${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}${this.S4()}${this.S4()}`;
  }

  private S4(): string {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
}
