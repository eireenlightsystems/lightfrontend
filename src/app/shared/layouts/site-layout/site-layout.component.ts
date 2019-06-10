import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {AuthService} from '../../services/auth.service';
import {MaterialService} from '../../classes/material.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent implements OnInit, AfterViewInit {

  @ViewChild('menu') menu: ElementRef;
  @ViewChild('operator') operator: ElementRef;
  @ViewChild('handbook') handbook: ElementRef;
  @ViewChild('admin') admin: ElementRef;
  @ViewChild('sidenav') sidenavRef: ElementRef;

  aSub: Subscription;
  itemMenu: string;
  sidenavLinks: any [];
  sidenavDefaultLinks = [
    {url: '/operator/fixture', name: 'Светильники', icon: 'lightbulb_outline'},
    {url: '/operator/node', name: 'Узлы/столбы', icon: 'assistant_photo'},
    {url: '/operator/gateway', name: 'Интернет шлюзы', icon: 'router'},
    {url: '/operator/sensor', name: 'Сенсоры', icon: 'hearing'}
  ];

  constructor(private auth: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.itemMenu = 'Управление оборудованием';
    this.sidenavLinks = this.sidenavDefaultLinks;
    MaterialService.initDropdown();
  }

  ngAfterViewInit() {
    MaterialService.initSidenav(this.sidenavRef);
  }

  onClickOperator(event: any) {
    this.sidenavLinks = this.sidenavDefaultLinks;
    this.itemMenu = 'Управление оборудованием';
  }

  onClickHandbook(event: any) {
    this.sidenavLinks = [
      {url: '/handbook/equipment/nodetype', name: 'Типы узлов'},
      {url: '/handbook/equipment/sensortype', name: 'Типы сенсоров'},
    ];
    this.itemMenu = 'Управление справочниками';
  }

  onClickAdmin(event: any) {
    this.sidenavLinks = [
      {url: '/admin', name: 'Нужно создать админ-ра'},
    ];
    this.itemMenu = 'Администирование приложения';
  }

  logout(event: Event) {
    event.preventDefault();
    // this.aSub need to remove a component from memory
    this.aSub = this.auth.logout().subscribe(
      () => this.router.navigate(['/login']),
    );
    // it is necessary to clear the token
    this.auth.clearToken();
  }

}
