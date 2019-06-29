import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../classes/auth.guard';

import {NotFoundComponent} from '../../../components/not-found/not-found.component';

import {OperatorLayoutComponent} from './operator-layout.component';
import {NodePageComponent} from '../../../../node/node-page/node-page.component';
import {NodelistPageComponent} from '../../../../node/node-page/node-masterdetails-page/nodelist-page/nodelist-page.component';
import {NodemapPageComponent} from '../../../../node/node-page/nodemap-page/nodemap-page.component';
import {GatewayPageComponent} from '../../../../gateway/gateway-page/gateway-page.component';
import {GatewaylistPageComponent} from '../../../../gateway/gateway-page/gateway-masterdetails-page/gatewaylist-page/gatewaylist-page.component';
import {GatewaymapPageComponent} from '../../../../gateway/gateway-page/gatewaymap-page/gatewaymap-page.component';
import {FixturePageComponent} from '../../../../fixture/fixture-page/fixture-page.component';
import {FixturelistPageComponent} from '../../../../fixture/fixture-page/fixture-masterdetails-page/fixturelist-page/fixturelist-page.component';
import {FixtureGrlistPageComponent} from '../../../../fixture/fixture-page/fixturegroup-md-page/fixture-grlist-page/fixture-grlist-page.component';
import {FixturemapPageComponent} from '../../../../fixture/fixture-page/fixturemap-page/fixturemap-page.component';
import {SensorPageComponent} from '../../../../sensor/sensor-page/sensor-page.component';
import {SensorlistPageComponent} from '../../../../sensor/sensor-page/sensor-md-page/sensorlist-page/sensorlist-page.component';
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
