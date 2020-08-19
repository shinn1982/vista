import { Component, OnInit, AfterViewInit, Input, OnChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { TopoService } from '../services/topo.service';
import { CommonService } from '../../../_common/services/common.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TranslateService } from '@ngx-translate/core';
import { MOCK_GET_TOPO } from '../mocks/topo-data';
import { Validators, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { Validator } from 'src/app/_common/utils/validator';

import * as _ from 'lodash';

@Component({
  selector: 'app-topology-detail',
  templateUrl: './topo-detail.component.html',
  styleUrls: ['./topo-detail.component.scss']
})
export class TopoDetailComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() selectElements: any;
  @Input() filterValue: string;
  @Output() closeTopoDetailEvent = new EventEmitter<boolean>();
  public detailType: string; // node /link/multi
  public actionType: string; // view / edit
  public nodeInfo: any;
  public linkInfo: any;
  public nodeList = [];
  public config: PerfectScrollbarConfigInterface = {};

  public nodeForm = this.formBuilder.group({
    hostnameCtrl: ['', [Validators.required]],
    sidCtrl: ['', [Validators.required, Validators.pattern(Validator.sidReg)]],
    ipCtrl: ['', [Validators.required, Validators.pattern(Validator.ipReg)]],

  });

  public linkForm = this.formBuilder.group({
    idCtrl: ['', []],
    sidCtrl: ['', [Validators.required, Validators.pattern(Validator.sidReg)]],
    ipCtrl: ['', [Validators.pattern(Validator.ipReg), Validators.maxLength(25)]],
    localCtrl: ['', [Validators.required]],
    remoteCtrl: ['', [Validators.required]],
    bandwidthCtrl: ['', [Validators.required, Validators.pattern(Validator.numberOnly)]],
    igpCtrl: ['10', [Validators.required, Validators.pattern(Validator.numberOnly)]],
    teCtrl: ['10', [Validators.required, Validators.pattern(Validator.numberOnly)]],
    delayCtrl: ['100', [Validators.required, Validators.pattern(Validator.numberOnly)]],
    affinityCtrl: ['', [Validators.pattern(Validator.numberOnly)]],
    qosFormArray: this.formBuilder.array([this.buildQosForm()])

  });

  constructor(
    private topoService: TopoService,
    private commonService: CommonService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
  ) { }

  public ngOnInit() {
    this.actionType = 'view';
    console.log('in topo detail init:', this.selectElements);
    this.getDetailData();
  }

  public ngAfterViewInit() {
    // this.doDragHeight();
    this.topoService.closeTopoDetailSubject.subscribe(() => {
      // from blank click
      if (this.actionType === 'edit') {
        // TODO select save or not
        this.closeTopoDetailEvent.emit();
      } else {
        this.closeTopoDetailEvent.emit();
      }
    });

    this.topoService.afterNodeSaved.subscribe(() => { this.getNodeData(); });
  }

  public ngOnChanges(changes: any) {
    if (changes.selectElements) {
      this.actionType = 'view';
      this.getDetailData();
    }

  }

  protected buildQosForm() {
    const classCtrl = new FormControl('Default', [Validators.required]);
    const reserveCtrl = new FormControl('', [Validators.required, Validators.pattern(Validator.numberOnly)]);
    const availableCtrl = new FormControl('', [Validators.pattern(Validator.numberOnly)]);

    return this.formBuilder.group({
      classCtrl,
      reserveCtrl,
      availableCtrl,
    });
  }

  public get qosFormArray() {
    return this.linkForm.controls.qosFormArray as FormArray;
  }

  public getNodeData() {
    this.topoService.getTopoData().subscribe(res => {
      if (!res.error) {
        this.nodeList = res.data.nodes;
      }
    });
  }

  protected getDetailData() {
    this.getNodeData();
    if (this.selectElements.nodes.length > 0) {
      this.detailType = 'node';
      const node = this.selectElements.nodes[0];
      this.nodeInfo = node.rawData;
      console.log(this.nodeInfo);
    } else if (this.selectElements.links.length > 0) {
      this.detailType = 'link';
      const link = this.selectElements.links[0];
      this.linkInfo = link.rawData;
    }
  }

  public ngOnDestroy() { }

  public delete() {
    let data;
    if (this.detailType === 'node') {
      data = this.nodeInfo;
      // request delete node api
    }
    if (this.detailType === 'link') {
      data = this.linkInfo;
      // request delete link api
    }
    this.topoService.removeElementSubject.next({ type: this.detailType, data });
    this.closeTopoDetailEvent.emit();
  }

  public edit() {
    this.actionType = 'edit';
    this.setEditData();
  }

  private setEditData() {
    if (this.detailType === 'node' && this.nodeInfo) {
      this.nodeForm.get('hostnameCtrl').setValue(this.nodeInfo.id);
      this.nodeForm.get('sidCtrl').setValue(this.nodeInfo.sid);
      this.nodeForm.get('ipCtrl').setValue(this.nodeInfo.ip);
    }

    if (this.detailType === 'link' && this.linkInfo) {
      this.linkForm.get('idCtrl').setValue(this.linkInfo.id);
      this.linkForm.get('sidCtrl').setValue(this.linkInfo.sid);
      this.linkForm.get('ipCtrl').setValue(this.linkInfo.ip);
      this.linkForm.get('localCtrl').setValue(this.linkInfo.local);
      this.linkForm.get('remoteCtrl').setValue(this.linkInfo.remote);
      this.linkForm.get('bandwidthCtrl').setValue(this.linkInfo.bandwidth);
      this.linkForm.get('igpCtrl').setValue(this.linkInfo.igp);
      this.linkForm.get('teCtrl').setValue(this.linkInfo.te);
      this.linkForm.get('delayCtrl').setValue(this.linkInfo.delay);
      this.linkForm.get('affinityCtrl').setValue(this.linkInfo.affinity);

      const qosList = this.linkInfo.qos_class;
      _.each(qosList, (qos: any, i: number) => {
        if (!this.qosFormArray.controls[i]) {
          this.addQosCtrl();
        }
        this.qosFormArray.controls[i].get('classCtrl').setValue(qos.class);
        this.qosFormArray.controls[i].get('reserveCtrl').setValue(qos.bandwidth_reserve);
        this.qosFormArray.controls[i].get('availableCtrl').setValue(qos.bandwidth_available);

      });
      console.log(this.linkForm.get('qosFormArray'));

    }
  }

  public addQosCtrl() {
    this.qosFormArray.push(this.buildQosForm());
  }

  public removeQosCtrl(index: number) {
    this.qosFormArray.removeAt(index);
    this.linkInfo.qos_class = _.pullAt(this.linkInfo.qos_class, index);
  }
  public cancel() {
    this.actionType = 'view';
  }

  public save() {
    if (this.detailType === 'node') {
      this.nodeInfo.id = this.nodeForm.get('hostnameCtrl').value;
      this.nodeInfo.ip = this.nodeForm.get('ipCtrl').value;
      this.nodeInfo.sid = this.nodeForm.get('sidCtrl').value;

    } else if (this.detailType === 'link') {
      let redrawFlag = false;
      let redrawLinkId = '';
      if (this.linkInfo.local !== this.linkForm.get('localCtrl').value || this.linkInfo.remote !== this.linkForm.get('remoteCtrl').value) {
        redrawFlag = true;
        redrawLinkId = this.linkInfo.id;
      }
      this.linkInfo.id = this.linkForm.get('idCtrl').value;
      this.linkInfo.ip = this.linkForm.get('ipCtrl').value;
      this.linkInfo.sid = this.linkForm.get('sidCtrl').value;
      this.linkInfo.local = this.linkForm.get('localCtrl').value;
      this.linkInfo.remote = this.linkForm.get('remoteCtrl').value;
      this.linkInfo.bandwidth = this.linkForm.get('bandwidthCtrl').value;
      this.linkInfo.igp = this.linkForm.get('igpCtrl').value;
      this.linkInfo.te = this.linkForm.get('teCtrl').value;
      this.linkInfo.delay = this.linkForm.get('delayCtrl').value;
      this.linkInfo.affinity = this.linkForm.get('affinityCtrl').value;
      // console.log(this.qosFormArray.getRawValue());
      this.linkInfo.qos_class = [];
      _.each(this.qosFormArray.getRawValue(), (qos: any) => {
        this.linkInfo.qos_class.push({
          class: qos.classCtrl,
          bandwidth_reserve: qos.reserveCtrl,
          bandwidth_available: qos.availableCtrl,
        });
      });

      // redrawlink
      this.topoService.redrawLinkSubject.next({
        linkId: redrawLinkId,
        newData: this.linkInfo
      });
    }
    this.actionType = 'view';
  }

  public canSave() {
    if (this.actionType === 'edit' && this.detailType === 'node' && this.nodeForm.valid) {
      return true;
    } else if (this.actionType === 'edit' && this.detailType === 'link' && this.linkForm.valid) {
      return true;
    }
    return false;
  }

  public goBack() {
    if (this.actionType === 'edit') {
      this.actionType = 'view';
    } else {
      this.closeTopoDetailEvent.emit();
    }
  }


}
