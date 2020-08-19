import {
  Component,
  ElementRef,
  AfterViewInit,
  Input,
  OnInit,
  OnDestroy,
  Output, EventEmitter
} from '@angular/core';
import { Options } from './options';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { SelectFilterPipe } from './filterPipe';


@Component({
  selector: 'app-choosen-select',
  templateUrl: './selectcommon.component.html',
  styleUrls: ['./style.scss']
})
export class SelectCommonComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output()
  selectedDataChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() options: Options;
  timer: any;
  flgs: any = {
    showlistFlg: false,
    disabledFlg: false
  };
  inputFilterLabel: string;
  selectedDataList: any = [];
  matchData: any = [];
  selectedObj: any = {};
  objectKeys = Object.keys;
  frameId: string;

  constructor(
    private elementRef: ElementRef
  ) { }

  public ngOnInit() {
    this.getId();
    this.initData();
    this.initSelected();
    this.initInputValue();
    this.setDisabledStatus(this.options.disabled);
  }

  public ngAfterViewInit() {
    const nativeElementIns = this.elementRef.nativeElement.querySelector('.frame');
    $('body').on('click', ($e: any) => {
      const id = $($e.target).attr('id');
      let ownflg;
      if (id) {
        ownflg = $($e.target).attr('id').indexOf(this.frameId) !== -1;
      } else {
        ownflg = false;
      }
      if (!$($e.target).hasClass('.frame') && $($e.target).closest('.frame').length === 0
        && $($e.target).attr('name') !== 'select-li' &&
        $($e.target).parent().attr('name') !== 'select-li' || !ownflg) {
        this.showList(false, $e);
      }
    });
    this.setLineHeight();
  }


  public showList(flg, $e) {
    if (!this.flgs.disabledFlg) {
      this.flgs.showlistFlg = flg;
      if (this.options.filter) {
        if (flg) {
          if (!this.inputFilterLabel) {
            this.matchData = _.cloneDeep(this.options.data);
          }
        } else {
          this.inputFilterLabel = '';
        }
      }
    }
  }

  public selectOption(perData, $e) {
    const clonePerData = _.cloneDeep(perData);
    if (this.options.type !== 'multi') {
      this.selectedObj = clonePerData;
    } else {
      perData.checked = true;
      this.selectedDataList.push(clonePerData);
      this.selectedDataList = _.uniqBy(this.selectedDataList, 'label');
      this.setCheckedStatus(perData);

    }
    if (this.options.filter_input) {
      this.inputFilterLabel = this.selectedObj.label;
    }
    this.setLineHeight();
    $e.stopPropagation();
  }

  public delSelectedData(perData, $e) {
    if (!this.flgs.disabledFlg) {
      _.remove(this.selectedDataList, (data: any) => {
        return perData.label === data.label;
      });
      for (const data of this.matchData) {
        if (data.label === perData.label) {
          data.checked = false;
        }
      }
      for (const data of this.options.data) {
        if (data.label === perData.label) {
          data.checked = false;
        }
      }
      this.setLineHeight();
    }
    $e.stopPropagation();
  }

  protected getId() {
    this.frameId = new Date().getTime() + '_' + Math.random() * 10 + 1;
  }

  protected initSelected() {
    // if (this.options.type !== 'group') {
    for (const perData of this.options.data) {
      if (perData && perData.checked) {
        if (this.options.type === 'basic' || this.options.type === 'group') {
          this.selectedObj = perData;
        } else if (this.options.type === 'multi') {
          this.selectedDataList.push(perData);
          this.selectedDataList = _.uniq(this.selectedDataList);
        }
      }
      if (this.options.type === 'group') {
        for (const liData of perData.data) {
          if (liData && liData.checked) {
            this.selectedObj = liData;
          }
        }
      }
    }
    // }
  }

  protected setCheckedStatus(selectedData) {
    if (this.options.type === 'multi') {
      for (const perData of this.options.data) {
        if (perData.label === selectedData.label) {
          perData.checked = true;
        }
      }
    }
  }

  protected initInputValue() {
    if (this.options.filter_input) {
      this.matchData = this.options.data;
      if (this.options.filter_input) {
        this.inputFilterLabel = this.selectedObj.label;
      }
    }
  }

  protected initData() {
    this.options.data = _.uniqBy(this.options.data, 'label');
  }
  public setDisabledStatus(flg) {
    const tabindex = flg ? null : '-1';
    const disabled = flg;
    this.flgs.disabledFlg = flg ? true : false;
    setTimeout(() => {
      const ele = this.elementRef.nativeElement.querySelector('.frame');
      const iptEle = this.elementRef.nativeElement.querySelector('.input-div>input');
      $(ele).attr('tabindex', tabindex);
      $(iptEle).prop('disabled', disabled);
    }, 0);
  }

  public filterByPipe() {
    this.flgs.showlistFlg = true;
    this.matchData = new SelectFilterPipe().transform(this.options.data, this.inputFilterLabel);
  }

  protected setLineHeight() {
    setTimeout(() => {
      if (this.options.type === 'multi') {
        const iptDiv = this.elementRef.nativeElement.querySelector('.input-div');
        const iconDiv = this.elementRef.nativeElement.querySelector('.icon-div');
        const height = $(iptDiv).css('height');
        $(iconDiv).css('line-height', height);
      }
      this.selectedDataChange.emit(this.selectedDataList);
    }, 0);
  }

  protected getSelectedValues() {
    let resList = [];
    if (this.options.type !== 'multi') {
      resList = [this.selectedObj];
    } else {
      resList = this.selectedDataList;
    }

    return _.cloneDeep(resList);
  }

  public ngOnDestroy() { }

}
