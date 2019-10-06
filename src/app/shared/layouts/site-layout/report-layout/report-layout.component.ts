// angular lib
import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
// app interfaces
import {NavItem} from '../../../interfaces';
// app services
// app components


@Component({
  selector: 'app-report-layout',
  templateUrl: './report-layout.component.html',
  styleUrls: ['./report-layout.component.css']
})
export class ReportLayoutComponent implements OnInit {

  // variables from master component
  @Input() theme: string;
  @Input() siteMap: NavItem[];
  @Input() tabsWidth: number;

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects

  // other variables


  constructor(private route: ActivatedRoute,
              public router: Router,
              // service
              public translate: TranslateService) {
  }

  ngOnInit() {
  }

}
