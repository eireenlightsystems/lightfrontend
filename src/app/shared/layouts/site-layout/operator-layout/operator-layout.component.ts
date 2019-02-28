import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {MaterialService} from "../../../classes/material.service";

import {AuthService} from "../../../services/auth.service";


@Component({
  selector: 'app-operator-layout',
  templateUrl: './operator-layout.component.html',
  styleUrls: ['./operator-layout.component.css']
})
export class OperatorLayoutComponent implements AfterViewInit {

  @ViewChild('floating') floatingRef: ElementRef
  // @ViewChild('sidenav') sidenavRef: ElementRef

  // links = [
  //   {url: 'node', name: 'Узлы/столбы'},
  //   {url: 'gateway', name: 'Интернет шлюзы'},
  //   {url: 'fixture', name: 'Светильники'},
  //   {url: 'fixturegroup', name: 'Светильники (группы)'}
  //
  // ]

  constructor(private auth: AuthService,
              private router: Router) {
  }

  ngOnDestroy() {

  }

  ngAfterViewInit() {
    MaterialService.initializeFloatingButton(this.floatingRef)
    //MaterialService.initSidenav(this.sidenavRef)
  }

}
