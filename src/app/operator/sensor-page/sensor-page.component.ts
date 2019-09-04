// angular lib
import {Component, OnInit, OnDestroy, ViewChild, Input} from '@angular/core';
// jqwidgets
// app interfaces
import {Contract, EquipmentType, NavItem, Owner} from '../../shared/interfaces';
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
  @Input() sensorTypes: EquipmentType[];
  @Input() contractSensors: Contract[];

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('sensorMdPageComponent', {static: false}) sensorMdPageComponent: SensorMdPageComponent;

  // other variables


  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
