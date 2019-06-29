import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../../classes/auth.guard';

import {NotFoundComponent} from '../../../components/not-found/not-found.component';

import {SiteLayoutComponent} from '../site-layout.component';
import {HandbookLayoutComponent} from './handbook-layout.component';
import {EquipmentTypeComponent} from '../../../../equipment-type/equipment-type.component';


// canActivate: [AuthGuard] - защита роутов
const routes: Routes = [
  // {
  //   path: '', component: SiteLayoutComponent, canActivate: [AuthGuard], children: [
  //     {
  //       path: 'handbook', component: HandbookLayoutComponent, children: [
  //         {path: 'equipment', component: EquipmentTypeComponent, children: [
  //             {path: 'nodetype', component: EquipmentTypeComponent},
  //             {path: 'sensortype', component: EquipmentTypeComponent}
  //           ]
  //         }
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
export class HandbookRoutingModule {
}
