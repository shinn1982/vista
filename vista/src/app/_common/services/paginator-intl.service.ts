import { MatPaginatorIntl } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

export class PaginatorIntlService extends MatPaginatorIntl {
  translate: TranslateService;
  injectTranslateService(translate: TranslateService) {
    this.translate = translate;
    this.translate.onLangChange.subscribe(() => {
      this.translateLabels();
    });

    this.translateLabels();
  }

  translateLabels() {
    this.itemsPerPageLabel = this.translate.instant('COMMON_USED_LABEL_PREPAGE');
    this.nextPageLabel = '';
    this.previousPageLabel = '';
    this.changes.next();
  }
}
