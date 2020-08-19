import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { CommonService } from 'src/app/_common/services/common.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-node-link-selection',
  templateUrl: './node-link-selection.component.html',
  styleUrls: ['./node-link-selection.component.scss']
})
export class NodeLinkSelectionComponent implements OnInit {
  public filterCtrl: FormControl;
  public selection: SelectionModel<NodeLinkSelectionComponent>;
  public selectedEles = [];
  public unselectedEles = [];
  public config: PerfectScrollbarConfigInterface = {};
  public cloneSourceData = [];
  public title: string;
  constructor(
    public dialogRef: MatDialogRef<NodeLinkSelectionComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceData: any,
    private translate: TranslateService,
    private commonService: CommonService,
  ) {
    this.selection = new SelectionModel(true, []);
  }

  public ngOnInit() {
    this.initForm();
    this.cloneSourceData = _.cloneDeep(this.sourceData.data);
    this.splitData(true);
    this.formatTitle();
  }

  protected initForm() {
    this.filterCtrl = new FormControl('', []);
    this.filterCtrl.valueChanges.pipe(
      debounceTime(500)
    ).subscribe((val: string) => {
      this.doFilter(val);
    });
  }

  protected formatTitle() {
    const map = {
      include: 'Include',
      exclude: 'Exclude'
    };
    this.title = `${map[this.sourceData.type]} Nodes/Links`;
  }

  protected splitData(initFlg?: boolean) {
    this.unselectedEles = _.filter(this.cloneSourceData, perEle => {
      perEle.checked = false;
      return !perEle.selected;
    });
    console.log('splitData', this.unselectedEles);
    if (initFlg) {
      this.selectedEles = _.filter(this.cloneSourceData, perEle => {
        perEle.checked = false;
        return perEle.selected;
      });
    }
    if (this.selectedEles.length > 0 && initFlg) {
      this.sortSelected();
    }
  }

  protected sortSelected() {
    for (let i = 0; i < this.selectedEles.length; i++) {
      if (this.selectedEles[i].selectedIndex) {
        this.swapItem(i, this.selectedEles[i].selectedIndex);
      }
    }
  }

  protected doFilter(filterVal: string) {
    if (!filterVal) { return false; }
    _.each(this.unselectedEles, (perEle) => {
      if (perEle.id) {
        if (perEle.id.indexOf(filterVal) !== -1) {
          perEle.show = true;
        } else {
          perEle.show = false;
        }
      }
    });
  }

  public cancel() {
    this.dialogRef.close(null);
  }

  public select(selectedFlg: boolean) {
    _.each(this.selection.selected, (perSelected: any) => {
        perSelected.selected = selectedFlg;
        if (selectedFlg) {
            const matchSeclectedIndex = _.indexOf(this.selectedEles, perSelected);
            if (matchSeclectedIndex === -1) {
                this.selectedEles.push(perSelected);
                perSelected.selectedIndex = matchSeclectedIndex;
             }

        } else {
            _.remove(this.selectedEles, perSelected);
            perSelected.selectedIndex = null;
        }
    });
    this.splitData();
    _.each(this.selectedEles, (perEle) => {
        perEle.checked = false;
    });
    _.each(this.unselectedEles, (perEle) => {
        perEle.checked = false;
    });
    this.selection.clear();
  }

  public swapItem(fromIndex, toIndex) {
    if (toIndex < 0 || toIndex === this.selectedEles.length) {
      return false;
    }
    this.selectedEles[toIndex] = this.selectedEles.splice(fromIndex, 1, this.selectedEles[toIndex])[0];
    this.selectedEles[toIndex].selectedIndex = toIndex;
  }

  public saveSelected() {
    this.dialogRef.close(this.selectedEles);
  }
}
