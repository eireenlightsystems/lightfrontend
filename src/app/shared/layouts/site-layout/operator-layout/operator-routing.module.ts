// @ts-ignore
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../classes/auth.guard';

import {NotFoundComponent} from '../../../components/not-found/not-found.component';

import {OperatorLayoutComponent} from './operator-layout.component';
import {NodePageComponent} from '../../../../operator/node-page/node-page.component';
import {NodelistPageComponent} from '../../../../operator/node-page/node-masterdetails-page/nodelist-page/nodelist-page.component';
import {NodemapPageComponent} from '../../../../operator/node-page/nodemap-page/nodemap-page.component';
import {GatewayPageComponent} from '../../../../operator/gateway-page/gateway-page.component';
import {GatewaylistPageComponent} from '../../../../operator/gateway-page/gateway-masterdetails-page/gatewaylist-page/gatewaylist-page.component';
import {GatewaymapPageComponent} from '../../../../operator/gateway-page/gatewaymap-page/gatewaymap-page.component';
import {FixturePageComponent} from '../../../../operator/fixture-page/fixture-page.component';
import {FixturelistPageComponent} from '../../../../operator/fixture-page/fixture-masterdetails-page/fixturelist-page/fixturelist-page.component';
import {FixtureGrlistPageComponent} from '../../../../operator/fixture-page/fixturegroup-md-page/fixture-grlist-page/fixture-grlist-page.component';
import {FixturemapPageComponent} from '../../../../operator/fixture-page/fixturemap-page/fixturemap-page.component';
import {SensorPageComponent} from '../../../../operator/sensor-page/sensor-page.component';
import {SensorlistPageComponent} from '../../../../operator/sensor-page/sensor-md-page/sensorlist-page/sensorlist-page.component';
import {SiteLayoutComponent} from '../site-layout.component';


// canActivate: [AuthGuard] - защита роутов
const routes: Routes = [
  // {
  //   path: '', component: SiteLayoutComponent, canActivate: [AuthGuard], children: [
  //     {
  //       path: 'operator', component: OperatorLayoutComponent, canActivate: [AuthGuard], children: [
  //
  //         // {path: '', redirectTo: 'fixture', pathMatch: 'full'},
  //         {
  //           path: 'node', component: NodePageComponent, canActivate: [AuthGuard], children: [
  //             {path: 'nodelist', component: NodelistPageComponent},
  //             {path: 'nodemap', component: NodemapPageComponent}
  //           ]
  //         },
  //
  //         {
  //           path: 'gateway', component: GatewayPageComponent, canActivate: [AuthGuard], children: [
  //             {path: 'gatewaylist', component: GatewaylistPageComponent},
  //             {path: 'gatewaymap', component: GatewaymapPageComponent}
  //           ]
  //         },
  //
  //         {
  //           path: 'fixture', component: FixturePageComponent, canActivate: [AuthGuard], children: [
  //             {path: 'fixturelist', component: FixturelistPageComponent},
  //             {path: 'fixturegroup', component: FixtureGrlistPageComponent},
  //             {path: 'fixturemap', component: FixturemapPageComponent}
  //           ]
  //         },
  //
  //         {
  //           path: 'sensor', component: SensorPageComponent, canActivate: [AuthGuard], children: [
  //             {path: 'sensorlist', component: SensorlistPageComponent}
  //           ]
  //         }
  //
  //       ]
  //     },
  //   ]
  // },
  // {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperatorRoutingModule {
}
