/**
 * (c) Copyright 2024 by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ContestCountingCircleDetails,
  CountingMachine,
  CountOfVotersInformation,
  CountOfVotersInformationSubTotal,
  DomainOfInfluenceType,
  SexType,
  VoterType,
  VotingCardChannel,
  VotingCardResultDetail,
  VotingChannel,
} from '../../../models';
import { groupBy, groupBySingle, sum } from '../../../services/utils/array.utils';
import {
  ContestDetailInfoDialogComponent,
  ContestDetailInfoDialogData,
  ContestDetailInfoDialogResult,
} from '../contest-detail-info-dialog/contest-detail-info-dialog.component';
import { DialogService, SnackbarService } from '@abraxas/voting-lib';
import { ContestCountingCircleDetailsService } from '../../../services/contest-counting-circle-details.service';
import { TranslateService } from '@ngx-translate/core';
import { ContestCountingCircleElectorateSummary } from '../../../models/contest-counting-circle-electorate.model';
import { DomainOfInfluenceCanton } from '@abraxas/voting-ausmittlung-service-proto/grpc/models/domain_of_influence_pb';

@Component({
  selector: 'vo-ausm-contest-detail-info',
  templateUrl: './contest-detail-info.component.html',
  styleUrls: ['./contest-detail-info.component.scss'],
})
export class ContestDetailInfoComponent {
  public readonly votingChannels: typeof VotingChannel = VotingChannel;
  public readonly domainOfInfluenceCantons: typeof DomainOfInfluenceCanton = DomainOfInfluenceCanton;

  public votingCardsByDoiType: { [key in keyof typeof DomainOfInfluenceType]?: VotingCardResultDetail[] } = {};
  public votingCardResultSummaries: SimpleVotingCardResultSummary[] = [];
  public swissMen: number = 0;
  public swissWomen: number = 0;
  public swissAbroadMen: number = 0;
  public swissAbroadWomen: number = 0;
  public totalSwiss: number = 0;
  public totalSwissAbroad: number = 0;
  public votingCardsValue?: VotingCardResultDetail[];
  public enabledVotingCardChannelsValue: VotingCardChannel[] = [];
  public domainOfInfluenceTypesValue?: DomainOfInfluenceType[];
  public countOfVotersValue?: CountOfVotersInformation;
  public electorateSummaryValue?: ContestCountingCircleElectorateSummary;
  public readonlyValue: boolean = true;

  private swissVotersInformation: Record<number, CountOfVotersInformationSubTotal> = {};
  private swissAbroadVotersInformation: Record<number, CountOfVotersInformationSubTotal> = {};

  @Input()
  public set readonly(v: boolean) {
    if (this.readonlyValue === v) {
      return;
    }

    this.readonlyValue = v;
    this.updateVotingCards();
  }

  @Input()
  public countingMachineEnabled: boolean = false;

  @Input()
  public newZhFeaturesEnabled: boolean = false;

  @Input()
  public eVoting: boolean = false;

  @Input()
  public swissAbroadHaveVotingRightsOnAnyBusiness: boolean = false;

  @Input()
  public countingMachine: CountingMachine = CountingMachine.COUNTING_MACHINE_UNSPECIFIED;

  @Input()
  public contestId?: string;

  @Input()
  public countingCircleId?: string;

  @Input()
  public canton: DomainOfInfluenceCanton = DomainOfInfluenceCanton.DOMAIN_OF_INFLUENCE_CANTON_UNSPECIFIED;

  @Input()
  public set countOfVoters(v: CountOfVotersInformation) {
    this.countOfVotersValue = v;
    this.updateCountOfVoters();
  }

  @Input()
  public set votingCards(value: VotingCardResultDetail[]) {
    if (value === this.votingCardsValue) {
      return;
    }

    this.votingCardsValue = value;
    this.updateVotingCards();
  }

  @Input()
  public set electorateSummary(value: ContestCountingCircleElectorateSummary | undefined) {
    if (value === this.electorateSummaryValue) {
      return;
    }

    this.electorateSummaryValue = value;
    this.updateVotingCards();
  }

  @Input()
  public set enabledVotingCardChannels(v: VotingCardChannel[]) {
    if (v === this.enabledVotingCardChannelsValue) {
      return;
    }

    this.enabledVotingCardChannelsValue = v;
    this.updateVotingCards();
  }

  @Input()
  public set domainOfInfluenceTypes(v: DomainOfInfluenceType[]) {
    if (v === this.domainOfInfluenceTypesValue) {
      return;
    }

    this.domainOfInfluenceTypesValue = v;
    this.updateVotingCards();
  }

  @Output()
  public saved: EventEmitter<ContestCountingCircleDetails> = new EventEmitter<ContestCountingCircleDetails>();

  constructor(
    private readonly dialogService: DialogService,
    private readonly contestCountingCircleDetailsService: ContestCountingCircleDetailsService,
    private readonly toast: SnackbarService,
    private readonly i18n: TranslateService,
  ) {}

  public updateCountOfVoters(): void {
    if (!this.countOfVotersValue) return;

    const swissInfos = this.countOfVotersValue.subTotalInfoList.filter(x => x.voterType === VoterType.VOTER_TYPE_SWISS);
    const swissAbroadInfos = this.countOfVotersValue.subTotalInfoList.filter(x => x.voterType === VoterType.VOTER_TYPE_SWISS_ABROAD);
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

    this.swissMen = this.getDetail(VoterType.VOTER_TYPE_SWISS, SexType.SEX_TYPE_MALE).countOfVoters ?? 0;
    this.swissWomen = this.getDetail(VoterType.VOTER_TYPE_SWISS, SexType.SEX_TYPE_FEMALE).countOfVoters ?? 0;
    this.totalSwiss = sum(Object.values(this.swissVotersInformation), x => x.countOfVoters);
    if (this.swissAbroadHaveVotingRightsOnAnyBusiness) {
      this.swissAbroadMen = this.getDetail(VoterType.VOTER_TYPE_SWISS_ABROAD, SexType.SEX_TYPE_MALE).countOfVoters ?? 0;
      this.swissAbroadWomen = this.getDetail(VoterType.VOTER_TYPE_SWISS_ABROAD, SexType.SEX_TYPE_FEMALE).countOfVoters ?? 0;
      this.totalSwissAbroad = sum(Object.values(this.swissAbroadVotersInformation), x => x.countOfVoters);
    }

    this.countOfVotersValue.totalCountOfVoters = this.totalSwiss + this.totalSwissAbroad;
  }

  public updateVotingCards(): void {
    if (!this.votingCardsValue || !this.domainOfInfluenceTypesValue || !this.enabledVotingCardChannelsValue) return;

    const vcByDoiType = groupBy(
      this.votingCardsValue,
      x => x.domainOfInfluenceType,
      x => x,
    );

    this.votingCardsByDoiType = {};
    const allVotingCards: VotingCardResultDetail[] = [];
    for (const doiType of this.domainOfInfluenceTypesValue) {
      const votingCardsForDoiType = vcByDoiType[doiType] ?? [];
      const byChannel = groupBy(
        votingCardsForDoiType,
        x => x.channel,
        x => x,
      );
      const vcDetails =
        this.enabledVotingCardChannelsValue.length === 0
          ? votingCardsForDoiType
          : this.enabledVotingCardChannelsValue.map(c => ({
              countOfReceivedVotingCards: byChannel[c.votingChannel]?.find(x => x.valid === c.valid)?.countOfReceivedVotingCards,
              domainOfInfluenceType: doiType,
              valid: c.valid,
              channel: c.votingChannel,
            }));

      allVotingCards.push(...vcDetails);
      this.votingCardsByDoiType[doiType] = vcDetails;
    }

    this.updateVotingCardResultSummaries();
    if (!this.readonlyValue) {
      this.votingCardsValue = allVotingCards;
    }
  }

  public async openDialog(): Promise<void> {
    if (!this.countOfVotersValue || !this.enabledVotingCardChannelsValue || !this.domainOfInfluenceTypesValue || !this.votingCardsValue)
      return;

    const data: ContestDetailInfoDialogData = {
      readonly: this.readonlyValue,
      domainOfInfluenceTypes: this.domainOfInfluenceTypesValue,
      countingMachineEnabled: this.countingMachineEnabled,
      newZhFeaturesEnabled: this.newZhFeaturesEnabled,
      eVoting: this.eVoting,
      swissAbroadHaveVotingRightsOnAnyBusiness: this.swissAbroadHaveVotingRightsOnAnyBusiness,
      countOfVoters: this.countOfVotersValue,
      enabledVotingCardChannels: this.enabledVotingCardChannelsValue,
      votingCards: this.votingCardsValue,
      countingMachine: this.countingMachine,
      canton: this.canton,
      contestId: this.contestId,
      countingCircleId: this.countingCircleId,
      electorateSummary: this.electorateSummaryValue,
    };

    const result = await this.dialogService.openForResult<ContestDetailInfoDialogComponent, ContestDetailInfoDialogResult>(
      ContestDetailInfoDialogComponent,
      data,
    );

    if (!result || this.readonlyValue || !this.contestId || !this.countingCircleId) {
      return;
    }

    this.countOfVotersValue = result.countOfVoters;
    this.countingMachine = result.countingMachine;
    this.votingCardsValue = result.votingCards;

    if (!this.countingMachineEnabled) {
      this.countingMachine = CountingMachine.COUNTING_MACHINE_UNSPECIFIED;
    }

    this.updateCountOfVoters();
    this.updateVotingCards();

    const details = {
      contestId: this.contestId,
      countingCircleId: this.countingCircleId,
      countingMachine: this.countingMachine,
      countOfVotersInformation: this.countOfVotersValue,
      votingCards: this.votingCardsValue,
      eVoting: this.eVoting,
    };

    await this.contestCountingCircleDetailsService.updateDetails(details);
    this.toast.success(this.i18n.instant('CONTEST.DETAIL.COUNTING_CIRCLE_DETAILS_SAVED'));
    this.saved.emit(details);
  }

  private getDetail(voterType: VoterType, sex: SexType): CountOfVotersInformationSubTotal {
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

    this.countOfVotersValue?.subTotalInfoList.push(result);
    return result;
  }

  private updateVotingCardResultSummaries(): void {
    this.votingCardResultSummaries = [];

    if (!this.electorateSummaryValue) {
      for (const doiType of this.domainOfInfluenceTypesValue!) {
        if (this.votingCardsByDoiType[doiType] === undefined) {
          continue;
        }

        const votingCards = this.votingCardsByDoiType[doiType] ?? [];
        this.votingCardResultSummaries.push({
          label: this.i18n.instant('DOMAIN_OF_INFLUENCE.TYPE', { type: this.i18n.instant(`DOMAIN_OF_INFLUENCE_TYPES.${doiType}`) }),
          votingCards: votingCards,
          totalVotingCards: sum(votingCards, x => x.countOfReceivedVotingCards ?? 0),
          totalValidVotingCards: sum(
            votingCards.filter(x => x.valid),
            x => x.countOfReceivedVotingCards ?? 0,
          ),
          hasInvalidVotingCardChannel: votingCards.some(x => !x.valid),
        });
      }

      return;
    }

    for (const electorate of this.electorateSummaryValue.effectiveElectoratesList) {
      const doiTypes = electorate.domainOfInfluenceTypesList;

      const votingCards = this.votingCardsByDoiType[doiTypes[0]] ?? [];
      this.votingCardResultSummaries.push({
        label: this.i18n.instant('DOMAIN_OF_INFLUENCE.TYPE', {
          type: doiTypes.map(d => this.i18n.instant(`DOMAIN_OF_INFLUENCE_TYPES.${d}`)).join(', '),
        }),
        votingCards: votingCards,
        totalVotingCards: sum(votingCards, x => x.countOfReceivedVotingCards ?? 0),
        totalValidVotingCards: sum(
          votingCards.filter(x => x.valid),
          x => x.countOfReceivedVotingCards ?? 0,
        ),
        hasInvalidVotingCardChannel: votingCards.some(x => !x.valid),
      });
    }
  }
}

interface SimpleVotingCardResultSummary {
  label: string;
  votingCards: VotingCardResultDetail[];
  totalVotingCards: number;
  totalValidVotingCards: number;
  hasInvalidVotingCardChannel: boolean;
}
