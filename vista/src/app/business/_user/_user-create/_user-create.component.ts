import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/_common/services/common.service';
import { UserService, UserFormModel } from '../user.service';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Validator } from '../../../_common/utils/validator';
import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

@Component({
  selector: 'app-user-create',
  templateUrl: './_user-create.component.html',
  styleUrls: ['./_user-create.component.scss']
})
export class UserCreateComponent implements OnInit, AfterViewInit, OnDestroy {

  public repwdPlaceHolder = this.translate.instant('USER_CREATE_REPASSWORD_LABEL');
  public breadCrumbData = [];
  public form = this.formBuilder.group({
    usernameCtrl: ['', [Validators.required, Validators.pattern(Validator.nameReg)]],
    aliasCtrl: ['', Validators.maxLength(24)],
    passwordInfo: this.formBuilder.group({
      passwordCtrl: ['', [Validators.pattern(Validator.passwordReg)]],
      rePasswordCtrl: ['']
    }),
    phoneNumberCtrl: ['', [Validators.pattern(Validator.phonenumberReg), Validators.maxLength(25)]],
    emailCtrl: ['', [Validators.pattern(Validator.emailReg), Validators.maxLength(45)]],
    descriptionCtrl: ['', Validators.maxLength(255)]
  });
  public flgs = {
    repwdRequired: false,
    rePwdRequiredErr: false,
    editFlag: false,
    pwdMatch: true,
    usernameLoading: false
  };
  private editUserId: string;
  private subscriptions: Subscription;
  private nameRepeatSub: Subscription;
  private paramFromList: any;

  constructor(
    private commonService: CommonService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) { }

  public ngOnInit() {
    this.subscriptions = new Subscription();
    this.setEditFlag();
    this.commonService.setBreadCrumbData(this.setBreadCrumbData.bind(this));
  }

  public ngAfterViewInit() {
    this.setNameRepeatListener();
    this.setPasswordListener();
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
    if (this.nameRepeatSub) {
      this.nameRepeatSub.unsubscribe();
    }
  }

  public save() {
    // this.commonService.showLoader();
    // const saveObj = this.flgs.editFlag ?
    //   new UserFormModel(this.form.getRawValue(), this.editUserId) :
    //   new UserFormModel(this.form.getRawValue());
    // const func = this.flgs.editFlag ? this.userService.updateUser(saveObj) : this.userService.createUser(saveObj);

    // this.subscriptions.add(func.subscribe(res => {
    //   this.commonService.hideLoader();
    //   this.commonService.showNewMessage(true, [this.translate.instant('COMMON_USED_LABEL_SUCCESS')]);
    //   const currentUserInfo = this.commonService.getCurrentUserInfos();
    //   if (this.flgs.editFlag && currentUserInfo && currentUserInfo.user_id === this.editUserId) {
    //     this.commonService.setNewUsername(saveObj.alias ? saveObj.alias : saveObj.username);
    //   }
    //   this.backToMainPage();
    // }));
  }

  public backToMainPage(crumbObj?: any) {
    let url = '';
    if (crumbObj && crumbObj.disabled) {
      return false;
    }
    url = crumbObj && crumbObj.path ? crumbObj.path : 'index/user';
    const userRole = this.commonService.getCurrentUserInfos().role || '';
    if (userRole !== 'owner') {
      url = 'index/policy-dashboard';
    }
    if (this.paramFromList) {
      this.router.navigate([url], { queryParams: { param: this.paramFromList } });
    } else {
      this.router.navigate([url]);
    }
  }

  private setBreadCrumbData() {
    const mainCrumbObj = { index: 0, path: 'index/user', label: this.translate.instant('HEADER_NAVBAR_USER'), disabled: false };
    const secondaryObj = {
      index: 1,
      path: '',
      label: this.flgs.editFlag ? this.translate.instant('USER_EDIT_HEADER') : this.translate.instant('USER_CREATE_HEADER'),
      disabled: true
    };
    this.breadCrumbData = [mainCrumbObj, secondaryObj];
  }

  private setEditFlag() {
    const userId = this.route.snapshot.queryParamMap.get('id');
    this.flgs.editFlag = userId ? true : false;
    if (this.flgs.editFlag) {
      // get params
      const queryParams = this.route.snapshot.queryParamMap;
      this.paramFromList = queryParams.get('param') ? queryParams.get('param') : null;
      this.getUserData(userId);
    }
  }

  private setEditData(rawData: any) {
    this.editUserId = rawData.id;
    this.form.setValue({
      usernameCtrl: rawData.username,
      aliasCtrl: rawData.alias,
      passwordInfo: {
        passwordCtrl: '',
        rePasswordCtrl: ''
      },
      phoneNumberCtrl: rawData.phone_number,
      emailCtrl: rawData.email,
      descriptionCtrl: rawData.description
    });
    this.form.get('usernameCtrl').disable();
  }

  /**
   * Check if the username already exists after the value is changed
   */
  private setNameRepeatListener() {
    const usernameCtrl = this.form.get('usernameCtrl') as FormControl;
    usernameCtrl.valueChanges.pipe(debounceTime(500)).subscribe(value => {
      this.flgs.usernameLoading = true;

      if (this.nameRepeatSub) {
        this.nameRepeatSub.unsubscribe();
      }

      this.nameRepeatSub = this.userService.checkNameRepeat(value).subscribe(res => {
        this.flgs.usernameLoading = false;
        this.commonService.repeatFormControlErrors(res.data.data_list, usernameCtrl);
      });
    });
  }

  private setPasswordListener() {
    const passwordGroup = this.form.get('passwordInfo');
    passwordGroup.valueChanges.subscribe(data => {
      this.pwdValidation(data);
    });
  }

  private pwdValidation(data: any) {
    const rePasswordCtrl = this.form.get('passwordInfo').get('rePasswordCtrl') as FormControl;
    const password = data.passwordCtrl;
    const rePassword = data.rePasswordCtrl;
    if (!password) {
      this.flgs.repwdRequired = false;  // repwd is required or not
      if (!rePassword) {
        this.flgs.pwdMatch = true;  // pwd and repwd is same or not
      } else {
        this.flgs.pwdMatch = false;
      }
    } else {
      if (!rePassword) {
        this.flgs.repwdRequired = true;
        this.flgs.pwdMatch = true;
      } else if (rePassword !== password) {
        this.flgs.repwdRequired = false;
        this.flgs.pwdMatch = false;
      } else {
        this.flgs.repwdRequired = false;
        this.flgs.pwdMatch = true;
      }
    }

    if (!this.flgs.repwdRequired && this.flgs.pwdMatch) {
      rePasswordCtrl.setErrors(null);
    } else if (!this.flgs.pwdMatch) {
      rePasswordCtrl.setErrors({ 'required': this.flgs.repwdRequired });
      rePasswordCtrl.setErrors({ 'pwdMatch': !this.flgs.pwdMatch });
    } else if (this.flgs.repwdRequired && this.flgs.pwdMatch) {
      rePasswordCtrl.setErrors({ 'required': this.flgs.repwdRequired });
    }
    this.repwdPlaceHolder = this.flgs.repwdRequired ?
      `${this.translate.instant('USER_CREATE_REPASSWORD_LABEL')} *` :
      this.translate.instant('USER_CREATE_REPASSWORD_LABEL');
  }

  private getUserData(userId: string) {
    // this.commonService.showLoader();
    // this.subscriptions.add(this.userService.getUserDetail(userId).subscribe(res => {
    //   this.commonService.hideLoader();
    //   const userList = res.data.data_list || [];
    //   const matchedUser = _.find(userList, (perUser) => {
    //     return perUser.id === userId;
    //   });
    //   if (matchedUser) {
    //     this.setEditData(matchedUser);
    //   } else {
    //     this.commonService.showNewMessage(false, [this.translate.instant('USER_NOT_EXIST')]);
    //   }
    // }));
  }

}
