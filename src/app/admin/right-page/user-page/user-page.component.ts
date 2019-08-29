import {Component, Input, OnInit, ViewChild} from '@angular/core';

import {NavItem, Person} from '../../../shared/interfaces';

import {UserMdPageComponent} from './user-md-page/user-md-page.component';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  // variables from master component
  @Input() siteMap: NavItem[];
  // role source
  // user source
  @Input() persons: Person[];

  // define variables - link to view objects
  @ViewChild('userMdPageComponent', {static: false}) userMdPageComponent: UserMdPageComponent;

  // define columns for table User
  roleSortcolumn: string[] = ['roleId'];
  roleColumns: any[] =
    [];

  // define a data source for filtering table columns User
  roleListBoxSource: any[] =
    [];

  // other variables

  constructor() {
  }

  ngOnInit() {
  }

}
