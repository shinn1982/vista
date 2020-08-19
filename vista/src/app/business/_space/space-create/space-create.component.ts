import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonService } from 'src/app/_common/services/common.service';
import { SpaceService, SpaceFormModel } from '../space.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Validator } from 'src/app/_common/utils/validator';
import { debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import * as _ from 'lodash';

@Component({
  selector: 'app-space-create',
  templateUrl: './space-create.component.html',
  styleUrls: ['./space-create.component.scss']
})
export class SpaceCreateComponent implements OnInit, AfterViewInit, OnDestroy {

  public form = this.formBuilder.group({
    spaceNameCtrl: ['', [Validators.required, Validators.pattern(Validator.nameReg)]],
    snmpCtrl: ['', [Validators.maxLength(30)]],
    descriptionCtrl: ['', [Validators.maxLength(255)]],
    filterCtrl: ['', [Validators.maxLength(255)]],
    bandwidthThresholdCtrl: ['90'],
    nameRegexArray: this.formBuilder.array(
      [new FormControl('', Validators.maxLength(255))]
    )
  });
  public breadCrumbData = [];
  public flgs = {
    editFlag: false,
    spaceNameLoading: false
  };
  private editSpaceId: string;
  private subscriptions: Subscription;
  private nameRepeatSub: Subscription;
  private paramFromList: any;
  constructor(
    private commonService: CommonService,
    private spaceService: SpaceService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) { }

  get nameRegexArray(): FormArray {
    return this.form.get('nameRegexArray') as FormArray;
  }

  public ngOnInit() {
    this.subscriptions = new Subscription();
    this.setEditFlag();
    this.commonService.setBreadCrumbData(this.setBreadCrumbData.bind(this));
  }

  public ngAfterViewInit() {
    this.setNameRepeatListener();
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public addNameRegex() {
    this.nameRegexArray.push(new FormControl('', Validators.maxLength(255)));
  }

  public deleteNameRegex(index: number) {
    this.nameRegexArray.removeAt(index);
  }

  public save() {
    // this.commonService.showLoader();
    // const saveObj = this.buildSaveObj();
    // const func = this.flgs.editFlag ? this.spaceService.updateSpace(saveObj) : this.spaceService.createSpace(saveObj);

    // this.subscriptions.add(func.subscribe(res => {
    //   this.commonService.hideLoader();
    //   if (!res.error) {
    //     this.commonService.showNewMessage(true, [this.translate.instant('COMMON_USED_LABEL_SUCCESS')]);
    //     this.spaceService.setSpaceList();
    //     this.backToMainPage();
    //   } else {
    //     this.commonService.showNewMessage(false, res.info.usr_err_mess);
    //   }
    // }));
  }

  public onUsageSliderFinish(evt: any) {
    this.form.get('bandwidthThresholdCtrl').setValue(evt.from);
  }

  public drop(event: CdkDragDrop<string[]>) {
    const tmp = this.nameRegexArray.at(event.previousIndex);
    this.nameRegexArray.removeAt(event.previousIndex);
    this.nameRegexArray.insert(event.currentIndex, tmp);
  }

  public backToMainPage(crumbObj?: any) {
    let url = '';
    if (crumbObj && crumbObj.disabled) {
      return false;
    }
    url = crumbObj && crumbObj.path ? crumbObj.path : 'index/space';
    if (this.paramFromList) {
      this.router.navigate([url], { queryParams: { param: this.paramFromList } });
    } else {
      this.router.navigate([url]);
    }
  }

  private setBreadCrumbData() {
    const mainCrumbObj = { index: 0, path: 'index/space', label: this.translate.instant('HEADER_NAVBAR_SPACE'), disabled: false };
    const secondaryObj = {
      index: 1,
      path: '',
      label: this.flgs.editFlag ?
        `Space${this.translate.instant('COMMON_USED_LABEL_EDIT')}` :
        `Space${this.translate.instant('COMMON_USED_LABEL_CREATE')}`,
      disabled: true
    };
    this.breadCrumbData = [mainCrumbObj, secondaryObj];
  }

  private setEditFlag() {
    const spaceId = this.route.snapshot.queryParamMap.get('id');
    this.flgs.editFlag = spaceId ? true : false;
    if (this.flgs.editFlag) {
      const queryParams = this.route.snapshot.queryParamMap;
      this.paramFromList = queryParams.get('param') ? queryParams.get('param') : null;
      this.getSpaceData(spaceId);
    }
  }

  private setEditData(rawData: any) {
    this.editSpaceId = rawData.id;
    this.form.patchValue({
      spaceNameCtrl: rawData.space_name,
      snmpCtrl: rawData.snmp_community,
      descriptionCtrl: rawData.description,
      filterCtrl: rawData.filter,
      bandwidthThresholdCtrl: rawData.bandwidth_threshold
    });
    if (rawData.node_name_regex_list.length > 0) {
      this.nameRegexArray.clear();
      const regList = _.sortBy(rawData.node_name_regex_list, 'priority');
      _.each(regList, data => {
        const control = new FormControl(data.regex, Validators.maxLength(255));
        this.nameRegexArray.insert(data.priority - 1, control);
      });
    }
    this.form.get('spaceNameCtrl').disable();
  }

  private setNameRepeatListener() {
    const spaceNameCtrl = this.form.get('spaceNameCtrl') as FormControl;
    spaceNameCtrl.valueChanges.pipe(debounceTime(500)).subscribe(value => {
      this.flgs.spaceNameLoading = true;
      if (this.nameRepeatSub) {
        this.nameRepeatSub.unsubscribe();
      }
      this.nameRepeatSub = this.spaceService.checkNameRepeat(value).subscribe(res => {
        this.flgs.spaceNameLoading = false;
        this.commonService.repeatFormControlErrors(res.data.data_list, spaceNameCtrl);
      });
    });
  }

  private getSpaceData(spaceId: string) {
    // this.commonService.showLoader();
    // this.spaceService.getSpaceDetail(spaceId).subscribe(res => {
    //   this.commonService.hideLoader();
    //   const dataList = res.data.data_list;
    //   if (dataList.length > 0) {
    //     this.setEditData(dataList[0]);
    //   } else {
    //     this.commonService.showNewMessage(false, [this.translate.instant('SPACE_NOT_EXIST')]);
    //   }
    // });
  }

  private buildSaveObj() {
    const saveObj = this.flgs.editFlag ? new SpaceFormModel(this.form.value, this.editSpaceId) : new SpaceFormModel(this.form.value);

    const nameRegList = _.filter(this.form.value.nameRegexArray, (o) => o);
    _.each(nameRegList, (data: string, index: number) => {
      saveObj.node_name_regex_list.push({
        priority: index + 1,
        regex: _.trim(data)
      });
    });

    return saveObj;
  }

}
