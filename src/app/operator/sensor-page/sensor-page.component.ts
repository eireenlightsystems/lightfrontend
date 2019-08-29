// @ts-ignore
import {Component, OnInit, OnDestroy, ViewChild, Input} from '@angular/core';

import {Contract, Geograph, Owner, EquipmentType, SettingButtonPanel} from '../../shared/interfaces';
import {SensorlistPageComponent} from './sensor-md-page/sensorlist-page/sensorlist-page.component';


@Component({
  selector: 'app-sensor-page',
  templateUrl: './sensor-page.component.html',
  styleUrls: ['./sensor-page.component.css']
})
export class SensorPageComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() ownerSensors: Owner[];
  @Input() sensorTypes: EquipmentType[];
  @Input() contractSensors: Contract[];

  // define variables - link to view objects
  @ViewChild('sensorlistPageComponent', {static: false}) sensorlistPageComponent: SensorlistPageComponent;

  // other variables
  settingSensorButtonPanel: SettingButtonPanel;

  constructor() {
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
