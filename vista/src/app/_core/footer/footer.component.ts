import { Component, OnInit } from '@angular/core';
import { LicenseService } from 'src/app/_common/services/license.service';
import { FOOTER_INFO } from '../../_config/app.conf';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  public footerInfo: string;
  public clientName: string;
  constructor(private licenseService: LicenseService) { }
  ngOnInit() {
    this.footerInfo = FOOTER_INFO;
    this.clientName = this.licenseService.getClientName() ? this.licenseService.getClientName() : 'Cisco';
  }

}
