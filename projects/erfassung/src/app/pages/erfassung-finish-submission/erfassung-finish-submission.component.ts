import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogService, SnackbarService } from '@abraxas/voting-lib';
import {
  ResultListResult,
  Contest,
  BreadcrumbItem,
  ResultService,
  BreadcrumbsService,
  ValidationOverviewDialogData,
  ValidationOverviewDialogResult,
  ValidationOverviewDialogComponent,
  SecondFactorTransactionService,
  CountingCircleResultState,
} from 'ausmittlung-lib';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-erfassung-finish-submission',
  templateUrl: './erfassung-finish-submission.component.html',
  styleUrls: ['./erfassung-finish-submission.component.scss'],
})
export class ErfassungFinishSubmissionComponent implements OnInit, OnDestroy {
  public readonly columns = [
    'select',
    'politicalBusinessTitle',
    'domainOfInfluenceType',
    'politicalBusinessType',
    'countingCircleResultState',
  ];

  public loadingResults: boolean = true;
  public finishingResultSubmissions: boolean = false;

  public resultsDataSource: MatTableDataSource<ResultListResult> = new MatTableDataSource<ResultListResult>();
  public selectedResults = new SelectionModel<ResultListResult>(true, []);
  public readyForCorrectionResults: ResultListResult[] = [];
  public allResultsSelected: boolean = false;
  public contest?: Contest;
  public countingCircleResultStates: typeof CountingCircleResultState = CountingCircleResultState;

  public breadcrumbs: BreadcrumbItem[] = [];

  private routeParamsSubscription: Subscription = Subscription.EMPTY;

  private contestId: string = '';
  private countingCircleId: string = '';
  private stateChangesSubscription?: Subscription;

  private static readonly emptySecondFactorId: string = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly resultService: ResultService,
    private readonly breadcrumbsService: BreadcrumbsService,
    private readonly dialogService: DialogService,
    private readonly secondFactorTransactionService: SecondFactorTransactionService,
    private readonly toast: SnackbarService,
    private readonly i18n: TranslateService,
  ) {
    this.breadcrumbs = this.breadcrumbsService.forFinishSubmission();
  }

  public get selectableResults(): ResultListResult[] {
    return this.resultsDataSource.data.filter(r => r.state === CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_SUBMISSION_ONGOING);
  }

  public async ngOnInit(): Promise<void> {
    this.routeParamsSubscription = this.route.params.subscribe(({ contestId, countingCircleId }) => {
      this.contestId = contestId;
      this.countingCircleId = countingCircleId;
      this.loadData();
    });
  }

  public ngOnDestroy(): void {
    this.routeParamsSubscription.unsubscribe();
    this.stateChangesSubscription?.unsubscribe();
  }

  public toggleResult(result: ResultListResult, selected?: boolean): void {
    if (selected === this.selectedResults.isSelected(result)) {
      return;
    }

    this.selectedResults.toggle(result);
    this.updateAllResultsSelected();
  }

  public selectAllResults(selected: boolean) {
    if (selected === this.allResultsSelected) {
      return;
    }

    if (selected) {
      this.selectedResults.select(...this.selectableResults);
    } else {
      this.selectedResults.clear();
    }

    this.updateAllResultsSelected();
  }

  public async finishSubmissionSelected(): Promise<void> {
    this.finishingResultSubmissions = true;

    const contestId = this.contestId;
    const ccId = this.countingCircleId!;
    const resultIds = this.selectedResults.selected.map(s => s.id);

    try {
      if (!(await this.confirmValidationOverviewDialog(contestId, ccId, resultIds))) {
        return;
      }

      await this.finishSubmission(contestId, ccId, resultIds);

      for (const result of this.selectedResults.selected) {
        result.state = CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_SUBMISSION_DONE;
      }

      this.selectedResults.clear();
      this.toast.success(this.i18n.instant('APP.SAVED'));
    } finally {
      this.finishingResultSubmissions = false;
    }
  }

  private async loadData(): Promise<void> {
    this.loadingResults = true;

    try {
      this.selectedResults.clear();

      const data = await this.resultService.getList(this.contestId, this.countingCircleId!);
      this.resultsDataSource.data = data.results;
      this.readyForCorrectionResults = data.results.filter(
        r => r.state === CountingCircleResultState.COUNTING_CIRCLE_RESULT_STATE_READY_FOR_CORRECTION,
      );
      this.contest = data.contest;
      this.updateAllResultsSelected();
    } finally {
      this.loadingResults = false;
    }
  }

  private updateAllResultsSelected(): void {
    this.allResultsSelected = this.selectableResults.length > 0 && this.selectedResults.selected.length === this.selectableResults.length;
  }

  private async confirmValidationOverviewDialog(contestId: string, countingCircleId: string, resultIds: string[]): Promise<boolean> {
    const validationSummaries = await this.resultService.validateCountingCircleResults(contestId, countingCircleId, resultIds);

    const data: ValidationOverviewDialogData = {
      validationSummaries: validationSummaries.summaries,
      canEmitSave: validationSummaries.isValid,
      header: `VALIDATION.COUNTING_CIRCLE_RESULTS.HEADER.FINISHING_OPERATION.${validationSummaries.isValid ? 'VALID' : 'INVALID'}`,
      saveLabel: !validationSummaries.isValid ? 'APP.CONTINUE' : 'COMMON.SAVE',
      validationResultsLabel: validationSummaries.isValid ? undefined : 'VALIDATION.COUNTING_CIRCLE_RESULTS.DESCRIPTION.INVALID',
    };

    const result = await this.dialogService.openForResult<ValidationOverviewDialogComponent, ValidationOverviewDialogResult>(
      ValidationOverviewDialogComponent,
      data,
    );

    return !!result && result.save;
  }

  private async finishSubmission(contestId: string, countingCircleId: string, resultIds: string[]): Promise<void> {
    const secondFactorTransaction = await this.resultService.prepareSubmissionFinished(contestId, countingCircleId, resultIds);
    if (!secondFactorTransaction.getId() || !secondFactorTransaction.getCode()) {
      await firstValueFrom(
        this.resultService.submissionFinished(
          contestId,
          countingCircleId,
          resultIds,
          ErfassungFinishSubmissionComponent.emptySecondFactorId,
        ),
      );
      return;
    }

    await this.secondFactorTransactionService.showDialogAndExecuteVerifyAction(
      () => this.resultService.submissionFinished(contestId, countingCircleId, resultIds, secondFactorTransaction.getId()),
      secondFactorTransaction.getCode(),
    );
  }
}
