import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

// canActivate: [AuthGuard] - защита роутов
const routes: Routes = [

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
