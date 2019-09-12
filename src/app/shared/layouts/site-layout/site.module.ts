// @ts-ignore
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, POSITION, PB_DIRECTION} from 'ngx-ui-loader';

import {SharedModule} from '../../shared.module';
import {MaterialModule} from '../../material-module';
import {TranslateModule} from '@ngx-translate/core';
import {ExtendedModule} from '@angular/flex-layout';
import {SiteRoutingModule} from './site-routing.module';

import {OperatorModule} from './operator-layout/operator.module';
import {DictionaryModule} from './dictionary-layout/dictionary.module';
import {AdminModule} from './admin-layout/admin.module';

import {SiteLayoutComponent} from './site-layout.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: 'yellow', // #EF5350
  fgsColor: 'yellow',
  bgsPosition: POSITION.bottomCenter,
  bgsSize: 40,
  bgsType: SPINNER.rectangleBounce, // background spinner type
  fgsType: SPINNER.threeStrings, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5, // progress bar thickness
  bgsOpacity: 0.9,
  hasProgressBar: false
};

@NgModule({
  declarations: [
    SiteLayoutComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),

    SiteRoutingModule,
    SharedModule,
    MaterialModule,
    TranslateModule,
    ExtendedModule,
    OperatorModule,
    DictionaryModule,
    AdminModule,
  ]
})
export class SiteModule {
}
