// @ts-ignore
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {SharedModule} from '../../../shared.module';
import {MaterialModule} from '../../../material-module';
import {TranslateModule} from '@ngx-translate/core';
import {ExtendedModule} from '@angular/flex-layout';
import {AdminRoutingModule} from './admin-routing.module';

import {AdminLayoutComponent} from './admin-layout.component';
import {RightPageComponent} from '../../../../admin/right-page/right-page.component';
import {UserPageComponent} from '../../../../admin/right-page/user-page/user-page.component';
import {UserMdPageComponent} from '../../../../admin/right-page/user-page/user-md-page/user-md-page.component';
import {UserlistPageComponent} from '../../../../admin/right-page/user-page/user-md-page/userlist-page/userlist-page.component';
import {RolePageComponent} from '../../../../admin/right-page/role-page/role-page.component';
import {RoleMdPageComponent} from '../../../../admin/right-page/role-page/role-md-page/role-md-page.component';
import {RolelistPageComponent} from '../../../../admin/right-page/role-page/role-md-page/rolelist-page/rolelist-page.component';
import {ComponentPageComponent} from '../../../../admin/right-page/component-page/component-page.component';
import {RolerightPageComponent} from '../../../../admin/right-page/roleright-page/roleright-page.component';
import {ComponentlistPageComponent} from '../../../../admin/right-page/component-page/componentlist-page/componentlist-page.component';
import {RightDemoComponent} from '../../../../admin/right-page/roleright-page/right-demo/right-demo.component';


@NgModule({
  declarations: [
    AdminLayoutComponent,
    RightPageComponent,
    UserPageComponent,
    UserMdPageComponent,
    UserlistPageComponent,
    RolePageComponent,
    RoleMdPageComponent,
    RolelistPageComponent,
    ComponentPageComponent,
    ComponentlistPageComponent,
    RolerightPageComponent,
    RightDemoComponent,
  ],
  exports: [
    AdminLayoutComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    AdminRoutingModule,
    SharedModule,
    MaterialModule,
    TranslateModule,
    ExtendedModule,
  ]
})
export class AdminModule {
}
