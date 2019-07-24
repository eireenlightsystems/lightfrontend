// @ts-ignore
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from '../../../shared.module';

import {HandbookLayoutComponent} from './handbook-layout.component';
import {HandbookRoutingModule} from './handbook-routing.module';
import {EquipmentTypeComponent} from '../../../../equipment-type/equipment-type.component';
import {ContragentComponent} from '../../../../contragent/contragent.component';
import {ContractComponent} from '../../../../contract/contract.component';
import {JsonFormatedPipe} from '../../../pipe/json-formated.pipe';


@NgModule({
  declarations: [
    HandbookLayoutComponent,
    EquipmentTypeComponent,
    ContragentComponent,
    ContractComponent,
    JsonFormatedPipe,
  ],
  exports: [
    HandbookLayoutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    HandbookRoutingModule,
    SharedModule,
  ]
})
export class HandbookModule {
}
