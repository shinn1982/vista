import { NgModule } from '@angular/core';
import { FormatTimePipe } from '../../pipe/format-time.pipe';
import { FormatCheckResultPipe } from '../../pipe/format-check-result.pipe';
import { FormatSessionStatusPipe } from '../../pipe/format-session-status.pipe';
import { FormatContainerStatusPipe } from '../../pipe/format-container-status.pipe';
import { FormatPolicyStatusPipe } from '../../pipe/format-policy-status.pipe';
import { FormatSecondsDHMSPipe } from '../../pipe/format-seconds-dhms.pipe';
import { FormaAFISAFIPipe } from '../../pipe/format-afi-safi.pipe';
import { FormatRefPolicyStatus } from '../../pipe/format-ref-policy-status.pipe';
import { FormatRefConditionStatus } from '../../pipe/format-ref-condition-status.pipe';
import { FormatSyncResultPipe } from '../../pipe/format-sync-pipe';
@NgModule({
  declarations: [
    FormatTimePipe,
    FormatCheckResultPipe,
    FormatSessionStatusPipe,
    FormatContainerStatusPipe,
    FormatPolicyStatusPipe,
    FormatSecondsDHMSPipe,
    FormaAFISAFIPipe,
    FormatRefPolicyStatus,
    FormatRefConditionStatus,
    FormatSyncResultPipe
  ],
  exports: [
    FormatTimePipe,
    FormatCheckResultPipe,
    FormatSessionStatusPipe,
    FormatContainerStatusPipe,
    FormatPolicyStatusPipe,
    FormatSecondsDHMSPipe,
    FormaAFISAFIPipe,
    FormatRefPolicyStatus,
    FormatRefConditionStatus,
    FormatSyncResultPipe
  ]
})
export class PipesSharedModule {

}
