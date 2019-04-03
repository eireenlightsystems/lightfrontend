import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './shared/classes/auth.guard';

import {LoginPageComponent} from './auth/login-page/login-page.component';
import {AuthLayoutComponent} from './shared/layouts/auth-layout/auth-layout.component';
import {SiteLayoutComponent} from './shared/layouts/site-layout/site-layout.component';
import {RegisterPageComponent} from './auth/register-page/register-page.component';
import {OperatorLayoutComponent} from './shared/layouts/site-layout/operator-layout/operator-layout.component';
import {AdminLayoutComponent} from './shared/layouts/site-layout/admin-layout/admin-layout.component';
import {FixturelistPageComponent} from './fixture/fixture-page/fixture-masterdetails-page/fixturelist-page/fixturelist-page.component';
import {HandbookLayoutComponent} from './shared/layouts/site-layout/handbook-layout/handbook-layout.component';
import {FixturemapPageComponent} from './fixture/fixture-page/fixturemap-page/fixturemap-page.component';
import {FixturePageComponent} from './fixture/fixture-page/fixture-page.component';
import {NodelistPageComponent} from './node/node-page/node-masterdetails-page/nodelist-page/nodelist-page.component';
import {NodemapPageComponent} from './node/node-page/nodemap-page/nodemap-page.component';
import {NodePageComponent} from './node/node-page/node-page.component';
import {GatewaylistPageComponent} from './gateway/gateway-page/gateway-masterdetails-page/gatewaylist-page/gatewaylist-page.component';
import {GatewayPageComponent} from './gateway/gateway-page/gateway-page.component';
import {GatewaymapPageComponent} from './gateway/gateway-page/gatewaymap-page/gatewaymap-page.component';
import {NotFoundComponent} from './shared/components/not-found/not-found.component';
import {FixtureGrlistPageComponent} from './fixture/fixture-page/fixturegroup-md-page/fixture-grlist-page/fixture-grlist-page.component';
import {SensorlistPageComponent} from './sensor/sensor-page/sensor-md-page/sensorlist-page/sensorlist-page.component';
import {SensorPageComponent} from './sensor/sensor-page/sensor-page.component';

// canActivate: [AuthGuard] - защита роутов
const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: 'login', component: LoginPageComponent},
      {path: 'register', component: RegisterPageComponent}
    ]
  },
  {
    path: '', component: SiteLayoutComponent, canActivate: [AuthGuard], children: [
      {
        path: 'operator', component: OperatorLayoutComponent, canActivate: [AuthGuard], children: [

          {path: '', redirectTo: 'node', pathMatch: 'full'},
          {
            path: 'node', component: NodePageComponent, canActivate: [AuthGuard], children: [
              {path: 'nodelist', component: NodelistPageComponent},
              {path: 'nodemap', component: NodemapPageComponent}
            ]
          },

          // {path: '', redirectTo: 'gateway', pathMatch: 'full'},
          {
            path: 'gateway', component: GatewayPageComponent, canActivate: [AuthGuard], children: [
              {path: 'gatewaylist', component: GatewaylistPageComponent},
              {path: 'gatewaymap', component: GatewaymapPageComponent}
            ]
          },

          {
            path: 'sensor', component: SensorPageComponent, canActivate: [AuthGuard], children: [
              {path: 'sensorlist', component: SensorlistPageComponent}
            ]
          },

          // {path: '', redirectTo: 'fixture', pathMatch: 'full'},
          {
            path: 'fixture', component: FixturePageComponent, canActivate: [AuthGuard], children: [
              {path: 'fixturelist', component: FixturelistPageComponent},
              {path: 'fixturegroup', component: FixtureGrlistPageComponent},
              {path: 'fixturemap', component: FixturemapPageComponent}
            ]
          }


        ]
      },
      {
        path: 'handbook', component: HandbookLayoutComponent
      },
      {
        path: 'admin', component: AdminLayoutComponent
      }
    ]
  },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
