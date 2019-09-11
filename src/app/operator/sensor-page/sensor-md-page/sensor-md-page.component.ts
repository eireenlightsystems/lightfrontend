// angular lib
import {Component, OnInit, OnDestroy, ViewChild, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
// app interfaces
import {Contract, Owner, SettingButtonPanel, NavItem, SensorType} from '../../../shared/interfaces';
// app services
// app components
import {SensorlistPageComponent} from './sensorlist-page/sensorlist-page.component';


@Component({
  selector: 'app-sensor-md-page',
  templateUrl: './sensor-md-page.component.html',
  styleUrls: ['./sensor-md-page.component.css']
})
export class SensorMdPageComponent implements OnInit, OnDestroy {

  // variables from parent component
  @Input() siteMap: NavItem[];
  @Input() ownerSensors: Owner[];
  @Input() sensorTypes: SensorType[];
  @Input() contractSensors: Contract[];

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('sensorlistPageComponent', {static: false}) sensorlistPageComponent: SensorlistPageComponent;

  // other variables
  settingSensorButtonPanel: SettingButtonPanel;

  constructor(
    // service
    public translate: TranslateService) {
  }

  ngOnInit() {
    // init sensor button panel
    this.settingSensorButtonPanel = {
      add: {
        visible: true,
        disabled: false,
      },
      upd: {
        visible: true,
        disabled: false,
      },
      del: {
        visible: true,
        disabled: false,
      },
      refresh: {
        visible: true,
        disabled: false,
      },
      setting: {
        visible: true,
        disabled: false,
      },
      filterList: {
        visible: true,
        disabled: false,
      },
      place: {
        visible: false,
        disabled: false,
      },
      pinDrop: {
        visible: false,
        disabled: false,
      },
      groupIn: {
        visible: false,
        disabled: false,
      },
      groupOut: {
        visible: false,
        disabled: false,
      },
      switchOn: {
        visible: false,
        disabled: false,
      },
      switchOff: {
        visible: false,
        disabled: false,
      }
    };
  }

  ngOnDestroy() {

  }
}
