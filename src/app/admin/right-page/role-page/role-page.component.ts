import {Component, Input, OnInit, ViewChild} from '@angular/core';

import {CompanyDepartment, NavItem, Person} from '../../../shared/interfaces';

import {RoleMdPageComponent} from './role-md-page/role-md-page.component';

@Component({
  selector: 'app-role-page',
  templateUrl: './role-page.component.html',
  styleUrls: ['./role-page.component.css']
})
export class RolePageComponent implements OnInit {

  // variables from master component
  @Input() siteMap: NavItem[];
  // role source
  @Input() companies: CompanyDepartment[];
  // user source

  // define variables - link to view objects
  @ViewChild('roleMdPageComponent', {static: false}) roleMdPageComponent: RoleMdPageComponent;

  // define columns for table User
  userSortcolumn: string[] = ['userId'];
  userColumns: any[] =
    [];

  // define a data source for filtering table columns User
  userListBoxSource: any[] =
    [];

  // other variables


  constructor() {
  }

  ngOnInit() {
  }

}
