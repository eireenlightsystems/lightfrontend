// angular lib
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
// app interfaces
import {CompanyDepartment, NavItem} from '../../../shared/interfaces';
// app services
// app components
import {RoleMdPageComponent} from './role-md-page/role-md-page.component';


@Component({
  selector: 'app-role-page',
  templateUrl: './role-page.component.html',
  styleUrls: ['./role-page.component.css']
})
export class RolePageComponent implements OnInit {

  // variables from parent component
  @Input() siteMap: NavItem[];
  // role source
  @Input() companies: CompanyDepartment[];
  // user source

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('roleMdPageComponent', {static: false}) roleMdPageComponent: RoleMdPageComponent;

  // other variables
  // define columns for table User
  userSortcolumn: string[] = ['userId'];
  userColumns: any[] =
    [];
  // define a data source for filtering table columns User
  userListBoxSource: any[] =
    [];


  constructor(
    // service
    public translate: TranslateService) {
  }

  ngOnInit() {
  }

}
