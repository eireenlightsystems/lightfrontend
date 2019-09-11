// angular lib
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
// app interfaces
import {NavItem, Person} from '../../../shared/interfaces';
// app services
// app components
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

  constructor(
    // service
    public translate: TranslateService) {
  }

  ngOnInit() {
  }

}
