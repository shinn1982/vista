import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { PathService } from '../services/path.service';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Validator } from 'src/app/_common/utils/validator';
import { MOCK_GET_TOPO } from '../mocks/topo-data';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { NodeLinkSelectionComponent } from './node-link-selection/node-link-selection.component';
import { BodPolicyService } from '../services/bod-policy.service';
import { CommonService } from 'src/app/_common/services/common.service';
import { AlertComponent } from 'src/app/_common/components/alert/alert.component';


@Component({
  selector: 'app-path-create',
  templateUrl: './path-create.component.html',
  styleUrls: ['./path-create.component.scss']
})
export class PathCreateComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() pathInfo: any;
  @Output() closePathCreateEvent = new EventEmitter<any>();
  public refreshFlg: any = false;
  public refreshSubject: Subject<any> = new Subject<any>();
  public pathForm: FormGroup;
  public algListForm: FormGroup;
  public nodeList;
  public includeSelectList = [];
  public excludeSelectList = [];
  public subscriptions = null;
  public flags = {
    showAlgForm: false,
    disableInput: false,
    showAlgDetail: false,
    showAlgResult: false,
    showPathForm: true,
  };
  public actionType = 'add';
  public pathType = 'common';
  public generateType = 'manual';
  public algResultList = [];
  public selectAlg = null;
  public saveData = null;
  constructor(
    private pathService: PathService,
    private formBuilder: FormBuilder,
    private dialogIns: MatDialog,
    private bodPolicyService: BodPolicyService,
    private commonService: CommonService,
    private alertDialog: MatDialog,
  ) {
    console.log('pathCreate:', this.pathInfo);

    this.subscriptions = new Subscription();
    this.nodeList = MOCK_GET_TOPO.data.nodes;
    this.initForm();

  }

  ngOnInit() {
    console.log('pathCreate init:', this.pathInfo);
    if (this.pathInfo) {
      this.actionType = 'edit';
    }
    this.setEditFormData();
  }

  public ngAfterViewInit() {
    // this.pathService.closeControlPanel.subscribe(() => {
    //   this.goBack();
    // });
  }

  public initForm() {

    // Validators
    const metricValidators = [Validators.required];
    const bandwidthValidators = [Validators.pattern(Validator.numberOnly)];
    const affinityValidators = [Validators.pattern(Validator.numberOnly)];
    const maskValidators = [];
    const disjointValidators = [Validators.required];
    const classValidators = [Validators.required];
    const priorityValidators = [Validators.required, Validators.pattern(Validator.numberOnly)];
    const colorValidators = [];
    const genTypeValidators = [Validators.required];

    const metricCtrl = new FormControl('igp', metricValidators);
    const bandwidthCtrl = new FormControl('', bandwidthValidators);
    const affinityCtrl = new FormControl('', affinityValidators);
    const maskCtrl = new FormControl('', maskValidators);
    const disjointCtrl = new FormControl('0', disjointValidators);
    const classCtrl = new FormControl('Default', classValidators);
    const priorityCtrl = new FormControl('0', priorityValidators);
    const includeCtrl = new FormControl('', []);
    const excludeCtrl = new FormControl('', []);

    const colorCtrl = new FormControl('', colorValidators);
    const generateTypeCtrl = new FormControl(this.generateType, genTypeValidators);
    const segmentListArray = this.formBuilder.array([this.buildSegmentListForm()]);

    this.pathForm = this.formBuilder.group({
      idCtrl: ['', [Validators.required]],
      headendCtrl: ['', [Validators.required]],
      tailendCtrl: ['', [Validators.required]],
      typeCtrl: [this.pathType, [Validators.required]],
      metricCtrl,
      bandwidthCtrl,
      affinityCtrl,
      maskCtrl,
      disjointCtrl,
      priorityCtrl,
      classCtrl,
      includeCtrl,
      excludeCtrl,
      colorCtrl,
      generateTypeCtrl,
      segmentListArray,
    });

    this.pathForm.get('includeCtrl').disable();
    this.pathForm.get('excludeCtrl').disable();

    // sr类型，生成segment-list方式
    generateTypeCtrl.valueChanges.subscribe((type) => {
      this.generateType = type;
      if (type === 'manual') {
        this.pathForm.get('colorCtrl').setValidators(colorValidators);
        this.pathForm.get('generateTypeCtrl').setValidators(genTypeValidators);
        // this.pathForm.addControl('segmentListArray', segmentListArray);

        this.pathForm.get('metricCtrl').clearValidators();
        this.pathForm.get('bandwidthCtrl').clearValidators();
        this.pathForm.get('affinityCtrl').clearValidators();
        this.pathForm.get('maskCtrl').clearValidators();
        this.pathForm.get('includeCtrl').clearValidators();
        this.pathForm.get('excludeCtrl').clearValidators();
        this.pathForm.get('disjointCtrl').clearValidators();
        this.pathForm.get('classCtrl').clearValidators();
        this.pathForm.get('priorityCtrl').clearValidators();
      } else {
        this.pathForm.get('colorCtrl').clearValidators();
        this.pathForm.get('generateTypeCtrl').clearValidators();
        // this.pathForm.removeControl('segmentListArray');

        // this.pathForm.addControl('metricCtrl', metricCtrl);
        // this.pathForm.addControl('bandwidthCtrl', bandwidthCtrl);
        // this.pathForm.addControl('affinityCtrl', affinityCtrl);
        // this.pathForm.addControl('maskCtrl', maskCtrl);
        // this.pathForm.addControl('includeCtrl', includeCtrl);
        // this.pathForm.addControl('excludeCtrl', excludeCtrl);
        // this.pathForm.addControl('disjointCtrl', disjointCtrl);
        // this.pathForm.addControl('classCtrl', classCtrl);
        // this.pathForm.addControl('priorityCtrl', priorityCtrl);
      }
      this.pathForm.updateValueAndValidity();
    });

    // path_type valueChanges
    this.pathForm.get('typeCtrl').valueChanges.subscribe((val) => {
      console.log('typeCtrl->valueChanges::', val);
      this.pathType = val;
      this.clearAlgResults();
      this.showAlgResult(false);

      if (val === 'sr') {
        this.pathForm.get('colorCtrl').setValidators(colorValidators);
        this.pathForm.get('generateTypeCtrl').setValidators(genTypeValidators);
        this.pathForm.get('metricCtrl').clearValidators();
        this.pathForm.get('bandwidthCtrl').clearValidators();
        this.pathForm.get('affinityCtrl').clearValidators();
        this.pathForm.get('maskCtrl').clearValidators();
        this.pathForm.get('disjointCtrl').clearValidators();
        this.pathForm.get('classCtrl').clearValidators();
        this.pathForm.get('priorityCtrl').clearValidators();

        if (!this.pathForm.get('generateTypeCtrl').value) {
          this.pathForm.get('generateTypeCtrl').setValue('manual');
        }
      } else {
        this.pathForm.get('colorCtrl').clearValidators();
        this.pathForm.get('generateTypeCtrl').clearValidators();
        if (this.pathForm.get('segmentListArray')) {
          this.pathForm.get('segmentListArray').clearValidators();
        }

        this.pathForm.get('metricCtrl').setValidators(metricValidators);
        this.pathForm.get('bandwidthCtrl').setValidators(bandwidthValidators);
        this.pathForm.get('affinityCtrl').setValidators(affinityValidators);
        this.pathForm.get('maskCtrl').setValidators(maskValidators);

        this.pathForm.get('disjointCtrl').setValidators(disjointValidators);
        this.pathForm.get('classCtrl').setValidators(classValidators);
        this.pathForm.get('priorityCtrl').setValidators(priorityValidators);
      }
      this.pathForm.updateValueAndValidity();

    });

    this.pathForm.get('headendCtrl').valueChanges.subscribe((val: any) => {
      this.headendChange(val);

    });

    this.pathForm.get('tailendCtrl').valueChanges.subscribe((val: any) => {
      this.headendChange(val);
    });

    this.algListForm = this.formBuilder.group({
      algFormArray: this.formBuilder.array([this.buildAlgForm()]),
    });

  }

  public headendChange(val) {
    this.removeIdFormList(this.includeSelectList, val);
    this.removeIdFormList(this.excludeSelectList, val);
    this.pathForm.get('includeCtrl').setValue(this.includeSelectList.join(', '));
    this.pathForm.get('excludeCtrl').setValue(this.excludeSelectList.join(', '));
  }

  private buildSegmentListForm(defaultVal: any = '') {
    const sidCtrl = new FormControl(defaultVal, [Validators.required]);
    // const ipCtrl = new FormControl('', [Validators.required, Validators.pattern(Validator.ipReg)]);

    return this.formBuilder.group({
      sidCtrl,
      // ipCtrl,
    });
  }

  public get segmentListArray() {
    return this.pathForm.controls.segmentListArray as FormArray;
  }

  public addSegment() {
    this.segmentListArray.push(this.buildSegmentListForm());
  }

  public removeSegment(index: number) {
    this.segmentListArray.removeAt(index);
  }

  private buildAlgForm() {
    const algCtrl = new FormControl('0', [Validators.required]);
    const sorterCtrl = new FormControl('metric', [Validators.required]);
    const topCtrl = new FormControl('10', [Validators.pattern(Validator.numberOnly)]);
    const limitCtrl = new FormControl('0', [Validators.pattern(Validator.numberOnly)]);

    return this.formBuilder.group({
      algCtrl,
      sorterCtrl,
      topCtrl,
      limitCtrl,
    });
  }

  public get algFormArray() {
    return this.algListForm.controls.algFormArray as FormArray;
  }

  public addAlg() {
    this.algFormArray.push(this.buildAlgForm());
  }

  public removeAlg(index: number) {
    this.algFormArray.removeAt(index);
  }
  public ngOnDestroy() { }

  public btnCalClick() {
    const path = this.pathForm.getRawValue();
    if (!path.idCtrl || !path.tailendCtrl) {
      this.commonService.showNewMessage(false, ['Name is required']);
      return;
    }
    if (!path.headendCtrl) {
      this.commonService.showNewMessage(false, ['Headend is required']);
      return;
    }
    if (!path.headendCtrl || !path.tailendCtrl) {
      this.commonService.showNewMessage(false, ['Tailend  is required']);
      return;
    }
    this.flags.showPathForm = false;
    this.flags.showAlgForm = true;
    this.flags.showAlgDetail = false;
    this.flags.showAlgResult = false;
  }

  private backToPathList() {
    this.closePathCreateEvent.emit({ close: true });
  }
  public goBack() {
    if (this.flags.showAlgDetail) {
      this.flags.showAlgDetail = false;
      this.flags.showPathForm = true;
      this.flags.showAlgResult = true;
    } else if (this.flags.showAlgForm) {
      this.flags.showAlgForm = false;
      this.flags.showPathForm = true;
    } else if (this.flags.showAlgResult) {

      const dialogRef = this.alertDialog.open(AlertComponent, {
        panelClass: 'custom-dialog-panel',
        disableClose: true,
        width: '25%',
        minWidth: 475,
        maxHeight: '100%',
        data: {
          type: 'warn',
          alertTitle: '确认',
          alertContent: `算路结果还未保存，确认返回算法选择页面？`,
          btnConfirm: '确认',
          btnCancel: '取消',
        }
      });

      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.clearAlgResults();
          this.flags.showAlgResult = false;
          this.flags.showAlgForm = true;
          this.flags.showPathForm = false;
        }
        this.pathService.clearAllPathSub.next();
        return true;
      });
    } else {
      this.backToPathList();
    }
  }

  private setSaveData() {
    if (this.pathInfo) {
      this.saveData = this.pathInfo;
    }
    const path = this.pathForm.getRawValue();
    this.saveData.id = path.idCtrl;
    this.saveData.headend = path.headendCtrl;
    this.saveData.tailend = path.tailendCtrl;
    this.saveData.metric = path.metricCtrl;
    this.saveData.bandwidth = path.bandwidthCtrl;
    this.saveData.affinity = path.affinityCtrl;
    this.saveData.mask = path.maskCtrl;
    this.saveData.include = this.includeSelectList;
    this.saveData.exclude = this.excludeSelectList;
    this.saveData.tiebreaker = false;
    this.saveData.disjoint = path.disjointCtrl === '1';
    this.saveData.reopt_enable = true;
    this.saveData.class = path.classCtrl;
    this.saveData.priority = path.priorityCtrl;
    this.saveData.path_type = path.typeCtrl;
    this.saveData.generate_type = path.generateTypeCtrl;
  }

  public save() {
    console.log('path-create: save');
    this.setSaveData();
    if (!this.saveData._id) {
      this.subscriptions.add(this.pathService.create(this.saveData).subscribe((res: any) => {
        this.backToPathList();
      }));
    } else {
      console.log('path edit:', this.saveData);
      this.subscriptions.add(this.pathService.put(this.saveData).subscribe((res: any) => {
        this.backToPathList();
      }));
    }
    this.pathService.afterPathSaved.next(true);
  }
  //#endregion

  public reset() {
    this.enablePathForm();
    this.clearAlgResults();
  }

  private enablePathForm() {
    this.pathForm.get('idCtrl').enable();
    this.pathForm.get('headendCtrl').enable();
    this.pathForm.get('tailendCtrl').enable();
    this.pathForm.get('typeCtrl').enable();
    this.pathForm.get('disjointCtrl').enable();

    this.pathForm.get('metricCtrl').enable();
    this.pathForm.get('bandwidthCtrl').enable();
    this.pathForm.get('affinityCtrl').enable();
    this.pathForm.get('maskCtrl').enable();
    this.pathForm.get('classCtrl').enable();
    this.pathForm.get('priorityCtrl').enable();

  }

  private clearAlgResults() {
    this.algResultList = [];
    this.flags.showAlgResult = false;
  }

  private disablePathForm() {
    this.pathForm.get('idCtrl').disable();
    this.pathForm.get('headendCtrl').disable();
    this.pathForm.get('tailendCtrl').disable();
    this.pathForm.get('typeCtrl').disable();
    this.pathForm.get('disjointCtrl').disable();

    this.pathForm.get('metricCtrl').disable();
    this.pathForm.get('bandwidthCtrl').disable();
    this.pathForm.get('affinityCtrl').disable();
    this.pathForm.get('maskCtrl').disable();
    this.pathForm.get('classCtrl').disable();
    this.pathForm.get('priorityCtrl').disable();
  }

  public commitAlg() {

    this.disablePathForm();

    const requestParam = this.generateCreateBodParam();

    const synchBod = this.bodPolicyService.SynchCreateBodPolicy(requestParam).subscribe((res: any) => {
      if (!res.status) {
        return;
      }
      _.each(res.data, (alg: any) => {
        const segmentList = [];
        _.each(alg.data.sids, (sid: any) => {
          segmentList.push(sid.sid);
        });
        alg.segmentList = segmentList.join(' ');
        this.saveData.segment_list = alg.segmentList;
      });
      this.algResultList = res.data;

    });
    this.subscriptions.add(synchBod);
    this.flags.showAlgForm = false;
    this.flags.showPathForm = true;
    this.flags.showAlgResult = true;
  }

  /**
   * 构建请求算法结果请求参数
   */
  private generateCreateBodParam() {
    console.log('pathCreate->commit alg->this.pathForm:', this.pathForm.getRawValue());
    const algs = [];
    _.each(this.algFormArray.controls, (fgroup: FormGroup) => {
      console.log('pathCreate->commit alg:', fgroup.getRawValue());
      const formValue = fgroup.getRawValue();
      algs.push({
        'algo': +formValue.algCtrl,
        'sorter': formValue.sorterCtrl,
        'top': +formValue.topCtrl,
        'limit': +formValue.limitCtrl,
        'loose': true
      });
    });
    const path = this.pathForm.getRawValue();
    const policy = {
      id: path.idCtrl,
      headend: path.headendCtrl,
      tailend: path.tailendCtrl,
      metric: path.metricCtrl,
      bandwidth: path.bandwidthCtrl,
      include: [],
      exclude: [],
      tiebreaker: false,
      disjoint: path.disjointCtrl === '1',
      reopt_enable: true,
      class: path.classCtrl,
      priority: path.priorityCtrl,
      path_type: path.typeCtrl,
      generate_type: path.generateTypeCtrl,
    };
    this.saveData = policy;
    const param = {
      'nodes': [],
      'links': [],
      'sr_policy': policy,
      'global': {
        'algorithm': algs,
        'flow_factor': 1.0,
        'real_traffic': false,
        'traffic_ratio': 1.0,
      },
    };

    return param;
  }

  /**
   * check whether btnAdd include or exclude enabled
   */
  public canOpenSelection() {
    const headend = this.pathForm.get('headendCtrl').value;
    const tailend = this.pathForm.get('tailendCtrl').value;
    if ((!headend || !tailend) || this.flags.showAlgResult) {
      return false;
    }
    return true;
  }

  private removeIdFormList(selectList, removeId) {
    if (selectList.length > 0) {
      _.remove(selectList, (id: string) => {
        return id === removeId;
      });
    }
  }

  /**
   * open dialog to select include or exclude nodes and links
   * @param type type:include/exclude
   */
  public openSelectionDialog(type: string) {
    const topoData = MOCK_GET_TOPO.data;
    const allList = [];
    const headend = this.pathForm.get('headendCtrl').value;
    const tailend = this.pathForm.get('tailendCtrl').value;
    if (!headend) {
      this.commonService.showNewMessage(false, ['Headend is required']);
      return;
    }

    if (!headend) {
      this.commonService.showNewMessage(false, ['Headend is required']);
      return;
    }

    _.each(topoData.nodes, (node: any) => {
      if (node.id !== headend && node.id !== tailend) {
        allList.push({
          id: node.id,
          type: 'node',
          checked: false,
          selected: false,
          show: true,
          rawData: node,
        });
      }
    });
    _.each(topoData.links, (link: any) => {
      allList.push({
        id: link.id,
        type: 'link',
        checked: false,
        selected: false,
        show: true,
        rawData: link,
      });
    });
    console.log('allList:', allList);

    if (type === 'include') {
      // remove items in excludeSelectList
      if (this.excludeSelectList.length > 0) {
        _.remove(allList, (item: any) => {
          return _.includes(this.excludeSelectList, item.id);

        });
      }
      if (this.includeSelectList.length > 0) {
        _.each(allList, (item: any) => {
          const match = _.find(this.includeSelectList, (id: any) => {
            return id === item.id;
          });
          if (match) {
            item.selected = true;
            item.checked = true;
          }
        });
      }
    }

    if (type === 'exclude') {
      if (this.includeSelectList.length > 0) {
        _.remove(allList, (item: any) => {
          return _.includes(this.includeSelectList, item.id);
        });
      }
      if (this.excludeSelectList.length > 0) {
        _.each(allList, (item: any) => {
          const match = _.find(this.excludeSelectList, (id: any) => {
            return id === item.id;
          });
          if (match) {
            item.selected = true;
            item.checked = true;
          }
        });
      }
    }


    const dialogConf = {
      panelClass: 'topo-setting-dialog-container',
      disableClose: true,
      backdropClass: 'transparent-overlay',
      position: {
        top: '100px',
        right: '40px'
      },
      // height: '500px',
      width: '600px',
      data: {
        parentScope: this,
        data: allList,
        disabledFlg: false,
        type,
      }
    };
    const selectDialogRef = this.dialogIns.open(NodeLinkSelectionComponent, dialogConf);
    this.subscriptions.add(selectDialogRef.afterClosed().subscribe((returnData) => {
      if (!returnData) {
        return;
      }
      // this.algPara[type] = returnData;
      console.log('selectDialogRef->afterClosed returnData:', returnData);

      if (type === 'include') {
        this.includeSelectList = [];
        _.each(returnData, (d: any) => {
          this.includeSelectList.push(d.id);
        });
      }
      if (type === 'exclude') {
        this.excludeSelectList = [];
        _.each(returnData, (d: any) => {
          this.excludeSelectList.push(d.id);
        });
      }

      this.setIncludeAndExcludeContrlValue(returnData, type);

    }));
  }

  private setIncludeAndExcludeContrlValue(selectedData, type?: string) {
    if (type) {
      const includeStr = this.includeSelectList.join(', ');
      const excludeStr = this.excludeSelectList.join(', ');
      this.pathForm.get(`includeCtrl`).setValue(includeStr);
      this.pathForm.get(`excludeCtrl`).setValue(excludeStr);

    } else {
      this.setIncludeAndExcludeContrlValue('include');
      this.setIncludeAndExcludeContrlValue('exclude');
    }

  }

  public showPathVis(paths: any) {
    _.each(paths, (path: any, i: number) => {
      this.pathService.pathCruveSub.next({
        type: 'add',
        path,
        uniq: i === 0 ? true : false
      });
    });
  }

  public showAlgDetail(alg: any) {
    console.log('path-create->showAlgDetail:', alg);
    this.flags.showAlgDetail = true;
    this.flags.showAlgResult = false;
    this.flags.showAlgForm = false;
    this.flags.showPathForm = false;
    this.selectAlg = alg;
  }

  private setEditFormData() {
    console.log('setEditFormData: pathInfo', this.pathInfo);

    if (!this.pathInfo) { return; }
    this.pathType = this.pathInfo.path_type;
    this.generateType = this.pathInfo.generate_type;
    this.pathForm.get('idCtrl').setValue(this.pathInfo.id);
    this.pathForm.get('headendCtrl').setValue(this.pathInfo.headend);
    this.pathForm.get('tailendCtrl').setValue(this.pathInfo.tailend);
    this.pathForm.get('typeCtrl').setValue(this.pathInfo.path_type);
    this.pathForm.get('metricCtrl').setValue(this.pathInfo.metric);
    this.pathForm.get('bandwidthCtrl').setValue(this.pathInfo.bandwidth);
    this.pathForm.get('affinityCtrl').setValue(this.pathInfo.affinity);
    this.pathForm.get('maskCtrl').setValue(this.pathInfo.mask);
    this.pathForm.get('disjointCtrl').setValue(this.pathInfo.disjoint ? '1' : '0');
    this.pathForm.get('priorityCtrl').setValue(this.pathInfo.priority);
    this.pathForm.get('classCtrl').setValue(this.pathInfo.class);
    this.pathForm.get('colorCtrl').setValue(this.pathInfo.color);
    this.pathForm.get('generateTypeCtrl').setValue(this.pathInfo.generate_type);

    this.setSegmentListData();
    this.setIncludeExcludeData();

    this.pathForm.updateValueAndValidity();


  }

  private setSegmentListData() {

  }

  private setIncludeExcludeData() {
    let includeStr = '';
    if (this.pathInfo.include.length > 0) {
      includeStr = this.pathInfo.include.join(', ');
    }
    let excludeStr = '';
    if (this.pathInfo.exclude.length > 0) {
      excludeStr = this.pathInfo.exclude.join(', ');
    }
    this.pathForm.get('includeCtrl').setValue(includeStr);
    this.includeSelectList = this.pathInfo.include;
    this.pathForm.get('excludeCtrl').setValue(excludeStr);
    this.excludeSelectList = this.pathInfo.exclude;
  }

  public applyAlg(index: number, alg: any) {
    console.log('applyAlg:', index, alg);
    const algForm = this.algFormArray.at(index) as FormGroup;
    const algFormVal = algForm.getRawValue();
    // console.log(algForm.getRawValue());

    this.segmentListArray.clear();
    _.each(alg.sids, (sid: any) => {
      this.segmentListArray.push(this.buildSegmentListForm(sid.sid));
    });

    this.saveData.algorithm = {
      algo: alg.algo_type,
      sorter: algFormVal.sorterCtrl,
      top: algFormVal.topCtrl,
      limit: algFormVal.limitCtrl,
      loose: alg.loose
    };
    this.saveData.segment_list = alg.segmentList;
    this.saveData.path = alg.data.paths;
    this.saveData.segments = alg.data.segs;
    console.log('applyAlg-> saveData:', this.saveData);
  }

  public sidTypeChange(ev: any) {
    console.log('path-create->sidTypeChange', ev);
  }

  public btnShowPathVisClick() {

    const path = this.pathForm.getRawValue();
    const policy = {
      id: path.idCtrl,
      headend: path.headendCtrl,
      tailend: path.tailendCtrl,
      metric: path.metricCtrl,
      bandwidth: path.bandwidthCtrl,
      include: [],
      exclude: [],
      tiebreaker: false,
      disjoint: path.disjointCtrl === '1',
      reopt_enable: true,
      class: path.classCtrl,
      priority: path.priorityCtrl,
      path_type: path.typeCtrl,
      generate_type: path.generateTypeCtrl,
    };
    this.saveData = policy;

    const segmentListArr = this.segmentListArray.getRawValue();
    const requestParam = {
      nodes: [],
      links: [],
      sids: [],
      'sr_policy': policy,
    };
    _.each(segmentListArr, (item) => {
      requestParam.sids.push(item.sidCtrl);
    });

    const sub = this.bodPolicyService.SynchCreateBodPolicy(requestParam).subscribe((res: any) => {
      if (res.error) {
        return;
      }
      console.log('manual response:', res);
      const paths = res.data.paths;
      this.saveData.segment_list = this.joinSidList(requestParam.sids);
      this.saveData.path = res.data.paths;
      this.saveData.segments = res.data.segs;

      // 显示路径
      this.showPathVis(paths);

    });
    this.subscriptions.add(sub);
  }

  // join sids
  private joinSidList(sids: Array<any>): string {
    const list = [];
    _.each(sids, (sid: any) => {
      list.push(sid.sid);
    });
    return list.join(' ');
  }

  private showAlgResult(flg) {
    this.flags.showAlgResult = flg;
  }

}
