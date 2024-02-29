/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { NumberComponent } from '@abraxas/base-components';
import { Component, Input, ViewChild } from '@angular/core';
import {
  ContestCountingCircleDetails,
  CountOfVotersInformation,
  CountOfVotersInformationSubTotal,
  SexType,
  VoterType,
} from '../../../models';
import { groupBySingle, sum } from '../../../services/utils/array.utils';

@Component({
  selector: 'vo-ausm-contest-detail-count-of-voters',
  templateUrl: './contest-detail-count-of-voters.component.html',
  styleUrls: ['./contest-detail-count-of-voters.component.scss'],
})
export class ContestDetailCountOfVotersComponent {
  public totalSwiss: number = 0;
  public totalSwissAbroad: number = 0;

  public sexTypes: typeof SexType = SexType;
  public voterTypes: typeof VoterType = VoterType;

  @Input()
  public readonly: boolean = true;

  @Input()
  public swissAbroadHaveVotingRightsOnAnyBusiness: boolean = false;

  @Input()
  public eVoting: boolean = false;

  public countOfVotersInformation!: CountOfVotersInformation;

  @ViewChild('maleFormfield')
  private maleFormfieldComponent!: NumberComponent;

  private swissVotersInformation: Record<number, CountOfVotersInformationSubTotal> = {};
  private swissAbroadVotersInformation: Record<number, CountOfVotersInformationSubTotal> = {};

  @Input()
  public set countOfVoters(v: CountOfVotersInformation) {
    this.countOfVotersInformation = v;

    const swissInfos = v.subTotalInfoList.filter(x => x.voterType === VoterType.VOTER_TYPE_SWISS);
    const swissAbroadInfos = v.subTotalInfoList.filter(x => x.voterType === VoterType.VOTER_TYPE_SWISS_ABROAD);
    this.swissVotersInformation = groupBySingle(
      swissInfos,
      x => x.sex as number,
      x => x,
    );
    this.swissAbroadVotersInformation = groupBySingle(
      swissAbroadInfos,
      x => x.sex as number,
      x => x,
    );
    this.updateTotal();
  }

  public getDetail(voterType: VoterType, sex: SexType): CountOfVotersInformationSubTotal {
    const records = voterType === VoterType.VOTER_TYPE_SWISS ? this.swissVotersInformation : this.swissAbroadVotersInformation;
    let result = records[sex];
    if (result) {
      return result;
    }

    // don't set the numeric value => textfield should be empty as long as no input is provided
    result = records[sex] = {
      sex,
      voterType,
    } as CountOfVotersInformationSubTotal;

    this.countOfVotersInformation.subTotalInfoList.push(result);
    return result;
  }

  public updateTotal(): void {
    this.totalSwiss = sum(Object.values(this.swissVotersInformation), x => x.countOfVoters);
    this.totalSwissAbroad = sum(Object.values(this.swissAbroadVotersInformation), x => x.countOfVoters);
    this.countOfVotersInformation.totalCountOfVoters = this.totalSwiss + this.totalSwissAbroad;
  }

  public setFocus(): void {
    this.maleFormfieldComponent.setFocus();
  }
}
