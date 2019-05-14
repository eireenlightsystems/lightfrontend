import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../classes/auth.guard';

import {SiteLayoutComponent} from './site-layout.component';
import {HandbookLayoutComponent} from './handbook-layout/handbook-layout.component';
import {AdminLayoutComponent} from './admin-layout/admin-layout.component';
import {NotFoundComponent} from '../../components/not-found/not-found.component';

// canActivate: [AuthGuard] - защита роутов
const siteRoutes: Routes = [
  {
    path: '', component: SiteLayoutComponent, canActivate: [AuthGuard], children: [

      {
        path: 'handbook', component: HandbookLayoutComponent
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
