import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from '../../../shared.module';
import {OperatorRoutingModule} from './operator-routing.module';

import {OperatorLayoutComponent} from './operator-layout.component';
import {FixturemapPageComponent} from '../../../../operator/fixture-page/fixturemap-page/fixturemap-page.component';
import {FixturelistPageComponent} from '../../../../operator/fixture-page/fixture-masterdetails-page/fixturelist-page/fixturelist-page.component';
import {FixturePageComponent} from '../../../../operator/fixture-page/fixture-page.component';
import {FixturecomeditFormComponent} from '../../../../operator/fixture-page/fixture-masterdetails-page/fixturecomlist-page/fixturecomedit-form/fixturecomedit-form.component';
import {FixturecomlistPageComponent} from '../../../../operator/fixture-page/fixture-masterdetails-page/fixturecomlist-page/fixturecomlist-page.component';
import {FixtureMasterdetailsPageComponent} from '../../../../operator/fixture-page/fixture-masterdetails-page/fixture-masterdetails-page.component';
import {FixturecomeditSwitchoffFormComponent} from '../../../../operator/fixture-page/fixture-masterdetails-page/fixturecomlist-page/fixturecomedit-switchoff-form/fixturecomedit-switchoff-form.component';
import {FixturecomspeedlistPageComponent} from '../../../../operator/fixture-page/fixture-masterdetails-page/fixturecomspeedlist-page/fixturecomspeedlist-page.component';
import {FixturecomspeededitFormComponent} from '../../../../operator/fixture-page/fixture-masterdetails-page/fixturecomspeedlist-page/fixturecomspeededit-form/fixturecomspeededit-form.component';
import {FixturegroupMdPageComponent} from '../../../../operator/fixture-page/fixturegroup-md-page/fixturegroup-md-page.component';
import {FixtureGrlistPageComponent} from '../../../../operator/fixture-page/fixturegroup-md-page/fixture-grlist-page/fixture-grlist-page.component';
import {NodePageComponent} from '../../../../operator/node-page/node-page.component';
import {NodelistPageComponent} from '../../../../operator/node-page/node-masterdetails-page/nodelist-page/nodelist-page.component';
import {NodemapPageComponent} from '../../../../operator/node-page/nodemap-page/nodemap-page.component';
import {NodeMasterdetailsPageComponent} from '../../../../operator/node-page/node-masterdetails-page/node-masterdetails-page.component';
import {GatewayPageComponent} from '../../../../operator/gateway-page/gateway-page.component';
import {GatewayMasterdetailsPageComponent} from '../../../../operator/gateway-page/gateway-masterdetails-page/gateway-masterdetails-page.component';
import {GatewaylistPageComponent} from '../../../../operator/gateway-page/gateway-masterdetails-page/gatewaylist-page/gatewaylist-page.component';
import {GatewaymapPageComponent} from '../../../../operator/gateway-page/gatewaymap-page/gatewaymap-page.component';
import {SensorPageComponent} from '../../../../operator/sensor-page/sensor-page.component';
import {SensorMdPageComponent} from '../../../../operator/sensor-page/sensor-md-page/sensor-md-page.component';
import {SensorlistPageComponent} from '../../../../operator/sensor-page/sensor-md-page/sensorlist-page/sensorlist-page.component';


@NgModule({
  declarations: [
    OperatorLayoutComponent,

    FixturemapPageComponent,
    FixturelistPageComponent,
    FixturePageComponent,
    FixturecomeditFormComponent,
    FixturecomlistPageComponent,
    FixtureMasterdetailsPageComponent,
    FixturecomeditSwitchoffFormComponent,
    FixturecomspeedlistPageComponent,
    FixturecomspeededitFormComponent,
    FixturegroupMdPageComponent,
    FixtureGrlistPageComponent,

    NodePageComponent,
    NodelistPageComponent,
    NodemapPageComponent,
    NodeMasterdetailsPageComponent,

    GatewayPageComponent,
    GatewayMasterdetailsPageComponent,
    GatewaylistPageComponent,
    GatewaymapPageComponent,

    SensorPageComponent,
    SensorMdPageComponent,
    SensorlistPageComponent,
  ],
  exports: [
    OperatorLayoutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    OperatorRoutingModule,
    SharedModule
  ]
})
export class OperatorModule {
}
