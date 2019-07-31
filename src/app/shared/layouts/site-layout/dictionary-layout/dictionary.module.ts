// @ts-ignore
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from '../../../shared.module';

import {DictionaryLayoutComponent} from './dictionary-layout.component';
import {DictionaryRoutingModule} from './dictionary-routing.module';
import {EquipmentTypeComponent} from '../../../../equipment-type/equipment-type.component';
import {ContragentComponent} from '../../../../contragent/contragent.component';
import {ContractComponent} from '../../../../contract/contract.component';
import {JsonFormatedPipe} from '../../../pipe/json-formated.pipe';


@NgModule({
  declarations: [
    DictionaryLayoutComponent,
    EquipmentTypeComponent,
    ContragentComponent,
    ContractComponent,
    JsonFormatedPipe,
  ],
  exports: [
    DictionaryLayoutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    DictionaryRoutingModule,
    SharedModule,
  ]
})
export class DictionaryModule {
}
