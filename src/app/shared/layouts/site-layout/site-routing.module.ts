import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../classes/auth.guard';

import {SiteLayoutComponent} from './site-layout.component';
import {DictionaryLayoutComponent} from './dictionary-layout/dictionary-layout.component';
import {AdminLayoutComponent} from './admin-layout/admin-layout.component';
import {NotFoundComponent} from '../../components/not-found/not-found.component';
import {NodelistPageComponent} from '../../../operator/node-page/node-masterdetails-page/nodelist-page/nodelist-page.component';
import {EquipmentTypeComponent} from '../../../dictionary/equipment-type/equipment-type.component';
import {OperatorLayoutComponent} from './operator-layout/operator-layout.component';
import {NodePageComponent} from '../../../operator/node-page/node-page.component';
import {NodemapPageComponent} from '../../../operator/node-page/nodemap-page/nodemap-page.component';
import {GatewayPageComponent} from '../../../operator/gateway-page/gateway-page.component';
import {GatewaylistPageComponent} from '../../../operator/gateway-page/gateway-masterdetails-page/gatewaylist-page/gatewaylist-page.component';
import {GatewaymapPageComponent} from '../../../operator/gateway-page/gatewaymap-page/gatewaymap-page.component';
import {FixturePageComponent} from '../../../operator/fixture-page/fixture-page.component';
import {FixturelistPageComponent} from '../../../operator/fixture-page/fixture-masterdetails-page/fixturelist-page/fixturelist-page.component';
import {FixtureGrlistPageComponent} from '../../../operator/fixture-page/fixturegroup-md-page/fixture-grlist-page/fixture-grlist-page.component';
import {FixturemapPageComponent} from '../../../operator/fixture-page/fixturemap-page/fixturemap-page.component';
import {SensorPageComponent} from '../../../operator/sensor-page/sensor-page.component';
import {SensorlistPageComponent} from '../../../operator/sensor-page/sensor-md-page/sensorlist-page/sensorlist-page.component';
import {ContragentComponent} from '../../../dictionary/contragent/contragent.component';
import {ContractComponent} from '../../../dictionary/contract/contract.component';
import {RightPageComponent} from '../../../admin/right-page/right-page.component';
import {UserPageComponent} from '../../../admin/right-page/user-page/user-page.component';
import {RolePageComponent} from '../../../admin/right-page/role-page/role-page.component';
import {ComponentPageComponent} from '../../../admin/right-page/component-page/component-page.component';
import {RolerightPageComponent} from '../../../admin/right-page/roleright-page/roleright-page.component';

// canActivate: [AuthGuard] - защита роутов
const routes: Routes = [
  {
    path: '', component: SiteLayoutComponent, canActivate: [AuthGuard], children: [
      {path: '', redirectTo: 'operator', pathMatch: 'full'},
      {
        path: 'dictionary', component: DictionaryLayoutComponent, canActivate: [AuthGuard], children: [
          {path: '', redirectTo: 'equipment', pathMatch: 'full'},
          {
            path: 'equipment', component: EquipmentTypeComponent, canActivate: [AuthGuard], children: [
              {path: 'fixturetype', component: EquipmentTypeComponent},
              {path: 'nodetype', component: EquipmentTypeComponent},
              {path: 'gatewaytype', component: EquipmentTypeComponent},
              {path: 'sensortype', component: EquipmentTypeComponent},
            ]
          },
          {
            path: 'contragent', component: ContragentComponent, canActivate: [AuthGuard], children: [
              {path: 'companies', component: ContragentComponent},
              {path: 'persons', component: ContragentComponent},
              {path: 'substations', component: ContragentComponent},
            ]
          },
          {
            path: 'contract', component: ContractComponent, canActivate: [AuthGuard], children: [
              {path: 'contracts', component: ContractComponent},
              {path: 'contracts-types', component: ContractComponent},
            ]
          }
        ]
      },
      {
        // path: 'operator', component: OperatorLayoutComponent, children: []
        path: 'operator', component: OperatorLayoutComponent, canActivate: [AuthGuard], children: [
          {path: '', redirectTo: 'fixture', pathMatch: 'full'},
          {
            path: 'node', component: NodePageComponent, canActivate: [AuthGuard], children: [
              {path: 'nodelist', component: NodelistPageComponent},
              {path: 'nodemap', component: NodemapPageComponent}
            ]
          },

          {
            path: 'gateway', component: GatewayPageComponent, canActivate: [AuthGuard], children: [
              {path: 'gatewaylist', component: GatewaylistPageComponent},
              {path: 'gatewaymap', component: GatewaymapPageComponent}
            ]
          },

          {
            path: 'fixture', component: FixturePageComponent, canActivate: [AuthGuard], children: [
              {path: 'fixturelist', component: FixturelistPageComponent},
              {path: 'fixturegroup', component: FixtureGrlistPageComponent},
              {path: 'fixturemap', component: FixturemapPageComponent}
            ]
          },

          {
            path: 'sensor', component: SensorPageComponent, canActivate: [AuthGuard], children: [
              {path: 'sensorlist', component: SensorlistPageComponent}
            ]
          }

        ]
      },
      {
        path: 'admin', component: AdminLayoutComponent, canActivate: [AuthGuard], children: [
          {path: '', redirectTo: 'right', pathMatch: 'full'},
          {path: 'right', component: RightPageComponent, canActivate: [AuthGuard], children: [
              {path: 'users', component: UserPageComponent},
              {path: 'roles', component: RolePageComponent},
              {path: 'components', component: ComponentPageComponent},
              {path: 'rolerights', component: RolerightPageComponent}
            ]}
        ]
      }
    ]
  },
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteRoutingModule {
}
