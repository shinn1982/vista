import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../_common/services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'yare-web4.0';

  constructor(translate: TranslateService, commonService: CommonService) {

    translate.addLangs(['en-US', 'zh-Hans']);
    const userInfo = commonService.getCurrentUserInfos();
    if (userInfo && userInfo.language) {
      translate.setDefaultLang(userInfo.language);
    } else {
      if (!navigator.language) {
        translate.setDefaultLang('zh-Hans');
      } else if (navigator.language === 'zh-CN') {
        translate.setDefaultLang('zh-Hans');
      } else if (navigator.language === 'en-US') {
        translate.setDefaultLang('en-US');
      }
    }
  }

}
