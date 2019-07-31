// @ts-ignore
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {SharedModule} from '../../shared.module';
import {SiteRoutingModule} from './site-routing.module';
import {OperatorModule} from './operator-layout/operator.module';
import {DictionaryModule} from './dictionary-layout/dictionary.module';

import {SiteLayoutComponent} from './site-layout.component';
import {AdminLayoutComponent} from './admin-layout/admin-layout.component';
import {MaterialModule} from '../../material-module';
import {TranslateModule} from '@ngx-translate/core';
import {ExtendedModule} from '@angular/flex-layout';


@NgModule({
  declarations: [
    SiteLayoutComponent,
    AdminLayoutComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    SiteRoutingModule,
    SharedModule,
    MaterialModule,
    TranslateModule,
    ExtendedModule,
    OperatorModule,
    DictionaryModule,

  ]
})
export class SiteModule {
}
