import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../classes/auth.guard';

import {SiteLayoutComponent} from './site-layout.component';
import {HandbookLayoutComponent} from './handbook-layout/handbook-layout.component';
import {AdminLayoutComponent} from './admin-layout/admin-layout.component';
import {NotFoundComponent} from '../../components/not-found/not-found.component';
import {NodelistPageComponent} from '../../../node/node-page/node-masterdetails-page/nodelist-page/nodelist-page.component';
import {NodeTypeService} from '../../services/node/nodeType.service';
import {EquipmentTypeComponent} from '../../../equipment-type/equipment-type.component';

// canActivate: [AuthGuard] - защита роутов
const siteRoutes: Routes = [
  {
    path: '', component: SiteLayoutComponent, canActivate: [AuthGuard], children: [

      {
        path: 'handbook', component: HandbookLayoutComponent, children: [
          {path: 'equipment', component: EquipmentTypeComponent, children: [
              {path: 'nodetype', component: EquipmentTypeComponent},
              {path: 'sensortype', component: EquipmentTypeComponent}
            ]}
        ]
      },
      {
        path: 'admin', component: AdminLayoutComponent
      }
    ]
  }
  // {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forChild(siteRoutes)],
  exports: [RouterModule]
})
export class SiteRoutingModule {
}
