// angular lib
import {Component, OnInit, OnDestroy, ViewChild, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
// app interfaces
import {Contract, NavItem, Owner, SensorType} from '../../shared/interfaces';
// app services
// app components
import {SensorMdPageComponent} from './sensor-md-page/sensor-md-page.component';


@Component({
  selector: 'app-sensor-page',
  templateUrl: './sensor-page.component.html',
  styleUrls: ['./sensor-page.component.css']
})
export class SensorPageComponent implements OnInit, OnDestroy {

  // variables from parent component
  @Input() siteMap: NavItem[];
  @Input() ownerSensors: Owner[];
  @Input() sensorTypes: SensorType[];
  @Input() contractSensors: Contract[];

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('sensorMdPageComponent', {static: false}) sensorMdPageComponent: SensorMdPageComponent;

  // other variables


  constructor(
    // service
    public translate: TranslateService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
