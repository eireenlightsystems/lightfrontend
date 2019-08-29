// @ts-ignore
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NavItem} from '../../../interfaces';
import {RightPageComponent} from '../../../../admin/right-page/right-page.component';


@Component({
  selector: 'app-dictionary-layout',
  templateUrl: './dictionary-layout.component.html',
  styleUrls: ['./dictionary-layout.component.css']
})
export class DictionaryLayoutComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() siteMap: NavItem[];
  @Input() tabsWidth: number;

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects

  // other variables

  constructor(private route: ActivatedRoute,
              private router: Router,
              // service
              ) {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }
}
