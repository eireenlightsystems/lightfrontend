// angular lib
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import * as cloneDeep from 'lodash/cloneDeep';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
// app interfaces
import {CompanyDepartment, NavItem, Person} from '../../shared/interfaces';
// app services
import {PersonService} from '../../shared/services/contragent/person.service';
import {CompanyService} from '../../shared/services/contragent/company.service';
// app components
import {RolerightPageComponent} from './roleright-page/roleright-page.component';
import {RightDemoComponent} from './roleright-page/right-demo/right-demo.component';


@Component({
  selector: 'app-right-page',
  templateUrl: './right-page.component.html',
  styleUrls: ['./right-page.component.css']
})
export class RightPageComponent implements OnInit, AfterViewInit, OnDestroy {

  // variables from master component
  @Input() siteMap: NavItem[];
  @Input() tabsWidth: number;
  @Input() theme: string;

  // determine the functions that need to be performed in the parent component
  @Output() onUpdRights = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('rolerightPageComponent', {static: false}) rolerightPageComponent: RolerightPageComponent;
  @ViewChild('rightDemoComponent', {static: false}) rightDemoComponent: RightDemoComponent;

  // other variables
  roleSiteMap: NavItem[] = [];
  persons: Person[];
  companies: CompanyDepartment[];
  oSubPersons: Subscription;
  oSubCompanies: Subscription;
  isRightDemoFormInit = false;


  constructor(
    private router: Router,
    // service
    public translate: TranslateService,
    private personService: PersonService,
    private companyService: CompanyService) {
  }

  ngOnInit() {
    this.fetch_refbook();
    this.roleSiteMap = cloneDeep(this.siteMap);
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    if (this.oSubPersons) {
      this.oSubPersons.unsubscribe();
    }
    if (this.oSubCompanies) {
      this.oSubCompanies.unsubscribe();
    }
  }

  fetch_refbook() {
    // refbook
    this.oSubPersons = this.personService.getAll().subscribe(persons => this.persons = persons);
    this.oSubCompanies = this.companyService.getAll().subscribe(
      companies => {
        this.companies = companies;

      }
    );
  }

  initRightDemoFormOpen() {
    this.isRightDemoFormInit = true;
  }

  initRightDemoFormClose() {
    this.isRightDemoFormInit = false;
    this.onUpdRights.emit();
  }

  // selectedTab() {
  //   switch (this.matTabGroup._selectedIndex) {
  //     case 0:
  //       console.log(this.matTabGroup._selectedIndex)
  //       this.router.navigate(['admin/right/users']);
  //       break;
  //     case 1:
  //       this.router.navigate(['admin/right/roles']);
  //       break;
  //     case 2:
  //       this.router.navigate(['admin/right/components']);
  //       break;
  //     case 3:
  //       this.router.navigate(['admin/right/rolerights']);
  //       break;
  //     default:
  //       break;
  //   }
  // }

  // getSelectedIndex() {
  //   switch (this.router.url) {
  //     case '/admin/right/users':
  //       return 0;
  //     case '/admin/right/roles':
  //       return 1;
  //     case '/admin/right/components':
  //       return 2;
  //     case '/admin/right/rolerights':
  //       return 3;
  //     default:
  //       return 3;
  //   }
  // }

}
