import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {SharedModule} from '../../shared.module';
import {SiteRoutingModule} from './site-routing.module';
import {OperatorModule} from './operator-layout/operator.module';
import {HandbookModule} from './handbook-layout/handbook.module';

import {SiteLayoutComponent} from './site-layout.component';
import {HandbookLayoutComponent} from './handbook-layout/handbook-layout.component';
import {AdminLayoutComponent} from './admin-layout/admin-layout.component';
import {EquipmentTypeComponent} from '../../../equipment-type/equipment-type.component';
import {SimpleHandbookComponent} from '../../components/simple-handbook/simple-handbook.component';
import {MaterialModule} from '../../material-module';
import {TranslateModule} from '@ngx-translate/core';
import {ExtendedModule} from '@angular/flex-layout';


@NgModule({
  declarations: [
    SiteLayoutComponent,
    // HandbookLayoutComponent,
    AdminLayoutComponent,
    // EquipmentTypeComponent,
    // SimpleHandbookComponent,
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
    HandbookModule,

  ]
})
export class SiteModule {
}
