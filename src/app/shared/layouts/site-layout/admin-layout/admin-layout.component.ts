// angular lib
import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
// app interfaces
import {CompanyDepartment, NavItem, Person} from '../../../interfaces';
// app services
// app components
import {RightPageComponent} from '../../../../admin/right-page/right-page.component';


@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit, AfterViewInit {

  // variables from parent component
  @Input() siteMap: NavItem[];
  @Input() tabsWidth: number;
  @Input() companies: CompanyDepartment[];
  @Input() persons: Person[];

  // determine the functions that need to be performed in the parent component
  @Output() onUpdRights = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('rightPageComponent', {static: false}) rightPageComponent: RightPageComponent;

  // other variables


  constructor(private route: ActivatedRoute,
              public router: Router,
              // service
              public translate: TranslateService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  // update rights
  updRights() {
    this.onUpdRights.emit();
  }
}
