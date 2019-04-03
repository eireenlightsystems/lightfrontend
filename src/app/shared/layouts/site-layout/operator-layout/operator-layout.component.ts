import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {MaterialService} from '../../../classes/material.service';

import {AuthService} from '../../../services/auth.service';


@Component({
  selector: 'app-operator-layout',
  templateUrl: './operator-layout.component.html',
  styleUrls: ['./operator-layout.component.css']
})
export class OperatorLayoutComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('floating') floatingRef: ElementRef;

  constructor(private auth: AuthService,
              private router: Router) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    MaterialService.initializeFloatingButton(this.floatingRef);
  }

  ngOnDestroy() {

  }

}
