/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

import {
  AppHeaderBarIamModule,
  AppHeaderBarModule,
  AppLayoutModule,
  AuthenticationModule,
  AuthorizationModule,
  BreadcrumbItemModule,
  BreadcrumbsModule,
  ButtonModule,
  CheckboxModule,
  DropdownModule,
  FORMFIELD_DEFAULT_OPTIONS,
  FormfieldModule,
  IconModule,
  LabelModule,
  NumberModule,
  RadioButtonModule,
  RoleModule,
  SnackbarModule,
  SpinnerModule,
  TableModule,
  TabsModule,
  TenantModule,
  TextModule,
  UserModule,
} from '@abraxas/base-components';
import { ENV_INJECTION_TOKEN, GRPC_INTERCEPTORS, VotingLibModule } from '@abraxas/voting-lib';
import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import localeDeCh from '@angular/common/locales/de-CH';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
  AusmittlungLibModule,
  BreadcrumbsService as BaseBreadcrumbsService,
  getCommonProviders,
  GRPC_ENV_INJECTION_TOKEN,
  REST_API_URL_INJECTION_TOKEN,
  RoleService as BaseRoleService,
} from 'ausmittlung-lib';
import { GrpcLanguageInterceptor } from '../../../ausmittlung-lib/src/lib/services/interceptors/grpc-language.interceptor';
import { HttpLanguageInterceptor } from '../../../ausmittlung-lib/src/lib/services/interceptors/http-language.interceptor';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BallotEndResultCountOfVotersComponent } from './components/ballot-end-result/ballot-end-result-count-of-voters/ballot-end-result-count-of-voters.component';
import { BallotEndResultComponent } from './components/ballot-end-result/ballot-end-result.component';
import { QuestionCountingCircleAlgorithmEndResultComponent } from './components/ballot-end-result/question-counting-circle-algorithm-end-result/question-counting-circle-algorithm-end-result';
import { QuestionEndResultEntryComponent } from './components/ballot-end-result/question-end-result-entry/question-end-result-entry.component';
import { QuestionPopularMajorityAlgorithmEndResultComponent } from './components/ballot-end-result/question-popular-majority-algorithm-end-result/question-popular-majority-algorithm-end-result.component';
import { EndResultPageComponent } from './components/end-result-page/end-result-page.component';
import { EndResultTypeSelectorComponent } from './components/end-result-type-selector/end-result-type-selector.component';
import { ExportCockpitDialogComponent } from './components/export-cockpit-dialog/export-cockpit-dialog.component';
import { ImportFileSelectComponent } from './components/import-file-select/import-file-select.component';
import { MajorityElectionEndResultCandidatesListComponent } from './components/majority-election-end-result-candidates-list/majority-election-end-result-candidates-list.component';
import { MajorityElectionLotDecisionDialogComponent } from './components/majority-election-lot-decision-dialog/majority-election-lot-decision-dialog.component';
import { MajorityElectionLotDecisionListComponent } from './components/majority-election-lot-decision-dialog/majority-election-lot-decision-list/majority-election-lot-decision-list.component';
import { MonitoringCockpitGridEntryComponent } from './components/monitoring-cockpit-grid-entry/monitoring-cockpit-grid-entry.component';
import { MonitoringCockpitGridFooterButtonsComponent } from './components/monitoring-cockpit-grid-footer/monitoring-cockpit-grid-footer-buttons/monitoring-cockpit-grid-footer-buttons.component';
import { MonitoringCockpitGridFooterComponent } from './components/monitoring-cockpit-grid-footer/monitoring-cockpit-grid-footer.component';
import { MonitoringCockpitGridComponent } from './components/monitoring-cockpit-grid/monitoring-cockpit-grid.component';
import { PoliticalBusinessResultExportDialogComponent } from './components/political-business-result-export-dialog/political-business-result-export-dialog.component';
import { ProportionalElectionLotDecisionDialogComponent } from './components/proportional-election-lot-decision-dialog/proportional-election-lot-decision-dialog.component';
import { ResultImportDialogComponent } from './components/result-import-dialog/result-import-dialog.component';
import { ResultImportListDialogComponent } from './components/result-import-list-dialog/result-import-list-dialog.component';
import { MajorityElectionEndResultComponent } from './pages/majority-election-end-result/majority-election-end-result.component';
import { MonitoringContestDetailComponent } from './pages/monitoring-contest-detail/monitoring-contest-detail.component';
import { MonitoringContestOverviewComponent } from './pages/monitoring-contest-overview/monitoring-contest-overview.component';
import { MonitoringOverviewComponent } from './pages/monitoring-overview/monitoring-overview.component';
import { ProportionalElectionEndResultComponent } from './pages/proportional-election-end-result/proportional-election-end-result.component';
import { VoteEndResultComponent } from './pages/vote-end-result/vote-end-result.component';
import { BreadcrumbsService } from './services/breadcrumbs.service';
import { RoleService } from './services/role.service';
import { WebpackTranslateLoader } from './services/webpack-translate-loader';
import { ExportCockpitPoliticalBusinessesComponent } from './components/export-cockpit-political-businesses/export-cockpit-political-businesses.component';
import { ProportionalElectionManualEndResultDialogComponent } from './components/proportional-election-manual-end-result-dialog/proportional-election-manual-end-result-dialog.component';

registerLocaleData(localeDeCh);

@NgModule({
  declarations: [
    AppComponent,
    MonitoringCockpitGridComponent,
    MonitoringCockpitGridEntryComponent,
    MonitoringContestDetailComponent,
    MonitoringContestOverviewComponent,
    MonitoringOverviewComponent,
    MonitoringCockpitGridFooterComponent,
    PoliticalBusinessResultExportDialogComponent,
    EndResultPageComponent,
    VoteEndResultComponent,
    BallotEndResultComponent,
    BallotEndResultCountOfVotersComponent,
    QuestionPopularMajorityAlgorithmEndResultComponent,
    QuestionEndResultEntryComponent,
    QuestionCountingCircleAlgorithmEndResultComponent,
    MajorityElectionEndResultComponent,
    MajorityElectionEndResultCandidatesListComponent,
    MajorityElectionLotDecisionDialogComponent,
    MajorityElectionLotDecisionListComponent,
    ProportionalElectionEndResultComponent,
    ProportionalElectionLotDecisionDialogComponent,
    ProportionalElectionManualEndResultDialogComponent,
    MonitoringCockpitGridFooterButtonsComponent,
    EndResultTypeSelectorComponent,
    ImportFileSelectComponent,
    ResultImportDialogComponent,
    ResultImportListDialogComponent,
    ExportCockpitDialogComponent,
    ExportCockpitPoliticalBusinessesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AuthenticationModule.forAuthentication(environment.authenticationConfig),
    AuthorizationModule.forAuthorization(environment),
    RoleModule.forRoot(environment),
    UserModule.forRoot(environment),
    TenantModule.forRoot(environment),
    SpinnerModule,
    ButtonModule,
    CheckboxModule,
    TableModule,
    SnackbarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: WebpackTranslateLoader,
      },
    }),
    BreadcrumbItemModule,
    BreadcrumbsModule,
    VotingLibModule.forRoot(environment.restApiEndpoint),
    AusmittlungLibModule.forRoot(environment.votingBasisWebApp),
    DropdownModule,
    IconModule,
    RadioButtonModule,
    MatStepperModule,
    MatIconModule,
    FormfieldModule,
    FormsModule,
    TextModule,
    NumberModule,
    LabelModule,
    TabsModule,
    AppLayoutModule,
    AppHeaderBarIamModule,
    AppHeaderBarModule,
  ],
  providers: [
    ...getCommonProviders(),
    {
      provide: GRPC_ENV_INJECTION_TOKEN,
      useValue: environment,
    },
    {
      provide: ENV_INJECTION_TOKEN,
      useValue: environment.env,
    },
    {
      provide: BaseRoleService,
      useClass: RoleService,
    },
    {
      provide: REST_API_URL_INJECTION_TOKEN,
      useValue: environment.restApiEndpoint,
    },
    {
      provide: BaseBreadcrumbsService,
      useClass: BreadcrumbsService,
    },
    {
      provide: GRPC_INTERCEPTORS,
      multi: true,
      useClass: GrpcLanguageInterceptor,
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: HttpLanguageInterceptor,
    },
    {
      provide: FORMFIELD_DEFAULT_OPTIONS,
      useValue: { optionalText: 'optional' },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
