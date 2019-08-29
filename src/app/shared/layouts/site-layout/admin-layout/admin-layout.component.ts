// @ts-ignore
import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import {NavItem} from '../../../interfaces';
import {RightPageComponent} from '../../../../admin/right-page/right-page.component';


@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit, AfterViewInit {

  // variables from master component
  @Input() siteMap: NavItem[];
  @Input() tabsWidth: number;

  // determine the functions that need to be performed in the parent component
  @Output() onUpdRights = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('rightPageComponent', {static: false}) rightPageComponent: RightPageComponent;

  // other variables


  constructor(private route: ActivatedRoute,
              private router: Router,
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
