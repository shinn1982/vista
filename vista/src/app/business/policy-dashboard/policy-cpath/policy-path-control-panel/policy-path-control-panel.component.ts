import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { PathService } from '../../services/path.service';

@Component({
  selector: 'app-policy-path-control-panel',
  templateUrl: './policy-path-control-panel.component.html',
  styleUrls: ['./policy-path-control-panel.component.scss']
})
export class PolicyPathControlPanelComponent implements OnInit, OnDestroy {

  @Input() pathList: Array<any>;

  constructor(
    private pathService: PathService) {
    if (!this.pathList || this.pathList.length === 0) { return; }
  }

  ngOnInit() { }

  ngOnDestroy() { }

  public closePanel() {
    this.pathService.closeControlPanel.next(true);
  }

}
