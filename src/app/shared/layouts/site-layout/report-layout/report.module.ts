import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {ReportRoutingModule} from './report-routing.module';
import {SharedModule} from '../../../shared.module';
import {MaterialModule} from '../../../material-module';
import {TranslateModule} from '@ngx-translate/core';
import {ExtendedModule} from '@angular/flex-layout';
import {ReportLayoutComponent} from './report-layout.component';
import {ReportCountFixturePageComponent} from '../../../../report/report-countfixture-page/report-count-fixture-page.component';
import {ReportPowerFixturePageComponent} from '../../../../report/report-powerfixture-page/report-power-fixture-page.component';

@NgModule({
  declarations: [
    ReportLayoutComponent,
    ReportCountFixturePageComponent,
    ReportPowerFixturePageComponent,
  ],
  exports: [
    ReportLayoutComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    ReportRoutingModule,
    SharedModule,
    MaterialModule,
    TranslateModule,
    ExtendedModule,
  ]
})
export class ReportModule {
}
