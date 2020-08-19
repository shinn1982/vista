import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from '../../../_common/services/common.service';
import { TopoService } from '../services/topo.service';

import * as _ from 'lodash';
import * as $ from 'jquery';
import { Subscription } from 'rxjs';
import { DEFAULT_LINK_WIDTH } from 'src/app/_config/app.conf';
@Component({
  selector: 'app-topo-settings',
  templateUrl: './topo-settings.component.html',
  styleUrls: ['./topo-settings.component.scss']
})
export class TopoSettingsComponent implements OnInit, OnDestroy {
  public userId: string;
  public spaceId: string;
  public currentTopo: any; // localStorage currentTopo
  public parentScope; // TopologyComponent Class instance
  public settingsObj; // settingsJson
  public fontRange = {
    class: 'font-slider',
    min: 10,
    max: 20,
    from: 14,
  };
  public loadRange = {
    class: 'load-slider',
    from: 50,
    from_min: 0,
    from_max: 100,
    to: 85,
    to_min: 0,
    to_max: 100,
  };
  public linkWidthRange = {
    class: 'font-slider',
    min: 1,
    max: 8,
    from: 4,
  };
  public nameRules: any[] = [
    {
      patten: 'x',
      separator: ',',
      newRule: '',
      sortNo: 1
    }
  ];
  public settingLoading: boolean;
  public simpleFlg = false;
  private previousSettings: any;
  private subscriptions: Subscription;
  constructor(
    public dialogRef: MatDialogRef<TopoSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private topoData: TopoService,
    private commonService: CommonService
  ) {
    this.subscriptions = new Subscription();
  }

  public ngOnInit() {
    this.setData();
    this.previousSettings = _.cloneDeep(this.settingsObj);
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private setData() {
    /**
     * brief : set global parameter (currentTopo,parentSope,settingsObj)
     */
    this.parentScope = this.data.parentScope;
    this.settingsObj = this.data.settingsObj;
    // console.log('data', this.data);
    if (this.parentScope) {
      this.currentTopo = this.parentScope.currentArea;
      this.userId = this.parentScope.userId;
      this.spaceId = this.parentScope.spaceId;
    }
    this.loadRange.from = this.settingsObj.load_range.from;
    this.loadRange.to = this.settingsObj.load_range.to;

    this.fontRange.from = this.settingsObj.font_size;
    this.simpleFlg = this.data.simpleFlg;

    const settingLinkWidth = localStorage.getItem('topo-link-width');
    this.linkWidthRange.from = settingLinkWidth ? +settingLinkWidth : DEFAULT_LINK_WIDTH;
  }
  public onfontsizeSliderFinish(data) {
    this.settingsObj.font_size = data.from;
    // this.topoService.changeSize(this.settingsObj.font_size);

  }

  public onLinkWidthSliderFinish(data: any) {
    console.log('251 onLinkWidthSliderFinish::', data);
    this.settingsObj.linkWidth = data.from;
    // save link width
    console.log('251 save link width:', this.settingsObj.linkWidth);
    localStorage.setItem('topo-link-width', this.settingsObj.linkWidth);
    // this.topoService.changeLinkWidth(this.settingsObj.linkWidth);
  }

  public onLoadSliderStart(data) {
    const from = data.from;
    const to = data.to;
    $('.load-slider-container .irs-line-left').css('width', from + '%');
    $('.load-slider-container .irs-line-right').css('width', 100 - to + '%');
  }
  public onLoadSliderChange(data) {
    console.log('onLoadSliderChange');
    const from = data.from;
    const to = data.to;
    $('.load-slider-container .irs-line-left').css('width', from + '%');
    $('.load-slider-container .irs-line-right').css('width', 100 - to + '%');

  }
  public onLoadSliderFinish(data) {
    console.log('onLoadSliderFinish');
    const from = data.from;
    const to = data.to;
    $('.load-slider-container .irs-line-left').css('width', from + '%');
    $('.load-slider-container .irs-line-right').css('width', 100 - to + '%');
    this.settingsObj.load_range.from = from;
    this.settingsObj.load_range.to = to;
    // this.topoService.autoLayoutObj.settingsObj = this.settingsObj;
    // this.changeColorPathColor();
    // this._topo.changeTopoByRange();
    // this.topoService.drawColorPath(null);
  }

  /**
   * toggle node label
   */
  public toggleNodeLabel(key: string): void {
    this.settingsObj.show_node_label[key] = !this.settingsObj.show_node_label[key];
    let selector: string = key;
    // ['sr', 'snmp', 'netconf', 'bgp_epe', 'bgp_rr']
    if (['sr', 'snmp', 'netconf', 'bgp_epe'].includes(selector)) {
      selector = `icon_${key}`;
    }
    // this.topoService.toggle(selector, this.settingsObj.show_node_label[key], this.settingsObj.show_node_label, false);
  }

  /**
   * toggle interface name
   */
  public interfaceName(): void {
    this.settingsObj.show_link_label.show_ift_name = !this.settingsObj.show_link_label.show_ift_name;
    console.log(this.settingsObj);
    // this.topoService.toggle('interfaceName', this.settingsObj.show_link_label.show_ift_name, this.settingsObj.show_link_label);
  }
  /**
   * toggle interface ip
   */
  public interface(): void {
    this.settingsObj.show_link_label.show_interface = !this.settingsObj.show_link_label.show_interface;
    // this.topoService.toggle('interfaceIp', this.settingsObj.show_link_label.show_interface, this.settingsObj.show_link_label);
  }
  /**
   * toggle link load
   */
  public load(): void {
    this.settingsObj.show_link_label.show_load = !this.settingsObj.show_link_label.show_load;
    // this.topoService.toggle('colorPath', this.settingsObj.show_link_label.show_load, this.settingsObj.show_link_label);
  }

  /**
   * toggle interface usage
   */
  public usage(): void {
    this.settingsObj.show_link_label.show_usage = !this.settingsObj.show_link_label.show_usage;
    // this.topoService.toggle('linkUsage', this.settingsObj.show_link_label.show_usage, this.settingsObj.show_link_label);
  }
  /**
   * toggle interface metric
   */
  public metric(type) {
    /**
     * brief : igp_metric and te_metric can not be shown at the same time
     */
    if (type === 'show_igp_metric') {
      this.settingsObj.show_link_label.show_igp_metric = !this.settingsObj.show_link_label.show_igp_metric;
      if (this.settingsObj.show_link_label.show_igp_metric) {
        this.settingsObj.show_link_label.show_te_metric = false;
      }
      // this.topoService.toggle('igp_metric', this.settingsObj.show_link_label.show_igp_metric, this.settingsObj.show_link_label);

    } else if (type === 'show_te_metric') {
      this.settingsObj.show_link_label.show_te_metric = !this.settingsObj.show_link_label.show_te_metric;
      if (this.settingsObj.show_link_label.show_te_metric) {
        this.settingsObj.show_link_label.show_igp_metric = false;
      }
      // this.topoService.toggle('te_metric', this.settingsObj.show_link_label.show_te_metric, this.settingsObj.show_link_label);

    }

  }

  /**
   * toggle interface delay
   */
  public delay(): void {
    this.settingsObj.show_link_label.show_delay = !this.settingsObj.show_link_label.show_delay;
    // this.topoService.toggle('delay', this.settingsObj.show_link_label.show_delay, this.settingsObj.show_link_label);
  }

  public arrow() {
    this.settingsObj.show_link_label.show_arrow = !this.settingsObj.show_link_label.show_arrow;
    // this._topo.marker(this.settingsObj.show_link_label.show_arrow);
    // this.topoService.toggle('marker', this.settingsObj.show_link_label.show_arrow, this.settingsObj.show_link_label);
  }

  public addRule() {
    const lastRule = _.maxBy(this.nameRules, (t) => t.sortNo);
    let maxSortNo = lastRule ? lastRule.sortNo : 0;
    maxSortNo += 1;
    this.nameRules.push({
      patten: '',
      separator: ',',
      newRule: '',
      sortNo: maxSortNo
    });
    console.log('nameRules', this.nameRules);
  }

  public removeRule(index: number) {
    // _.remove(this.nameRules, (item) => item.patten === rule.patten && item.separator === rule.separator
    // && item.newRule === rule.newRule);
    this.nameRules.splice(index, 1);
    _.each(this.nameRules, (item, idx) => {
      item.sortNo = (idx + 1);
    });
    console.log('nameRules', this.nameRules);
  }

  public moveForward(rule: any) {
    // 当前行sortNo - 1
    // 当前行前面一行 sortNo + 1
    const curSortNo = rule.sortNo;
    const preRule = _.find(this.nameRules, (item) => item.sortNo === curSortNo - 1);
    if (!preRule) {
      return;
    }
    rule.sortNo = curSortNo - 1;
    preRule.sortNo = curSortNo;
    this.nameRules = _.orderBy(this.nameRules, ['sortNo'], ['asc']);
  }

  public moveBackward(rule: any) {
    // 当前行sortNo + 1
    // 当前行后面一行 sortNo - 1
    const curSortNo = rule.sortNo;
    const nextRule = _.find(this.nameRules, (item) => item.sortNo === curSortNo + 1);
    if (!nextRule) {
      return;
    }
    rule.sortNo = curSortNo + 1;
    nextRule.sortNo = curSortNo;
    this.nameRules = _.orderBy(this.nameRules, ['sortNo'], ['asc']);
  }
  public saveSettings() {
    this.settingLoading = true;
    const summaryOpt = {
      space_id: this.spaceId,
      user_id: this.userId,
      as_num: this.currentTopo.as_num,
      protocol_id: this.currentTopo.protocol_id,
      instances_id: this.currentTopo.instances_id,
      area_id: this.currentTopo.area_id
    };
    // this.subscriptions.add(
    //   this.topoData.saveTopoSettings(summaryOpt, this.settingsObj).subscribe(res => {
    //     this.settingLoading = false;
    //     if (res.error) {
    //       this.commonService.showNewMessage(false, [`配置保存失败！${res.info.usr_err_mess}`]);
    //       return;
    //     }
    //     this.dialogRef.close({ status: true, data: this.settingsObj });

    //   })
    // );

  }

  public cancelSettings() {
    this.dialogRef.close({ status: false, data: this.previousSettings });
  }

}
