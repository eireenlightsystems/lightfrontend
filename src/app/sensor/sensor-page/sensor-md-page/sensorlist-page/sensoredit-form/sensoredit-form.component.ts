import {Component, EventEmitter, Input, Output, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {MaterialService} from '../../../../../shared/classes/material.service';
import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import {jqxDropDownListComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdropdownlist';

import {Sensor, Contract, EquipmentType} from '../../../../../shared/interfaces';
import {SensorService} from '../../../../../shared/services/sensor/sensor.service';
import {isUndefined} from 'util';

@Component({
  selector: 'app-sensoredit-form',
  templateUrl: './sensoredit-form.component.html',
  styleUrls: ['./sensoredit-form.component.css']
})
export class SensoreditFormComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() sensorTypes: EquipmentType[];
  @Input() contractSensors: Contract[];

  // determine the functions that need to be performed in the parent component
  @Output() onSaveEditwinBtn = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('editWindow') editWindow: jqxWindowComponent;
  @ViewChild('contractId') contractId: jqxDropDownListComponent;
  @ViewChild('sensorTypeId') sensorTypeId: jqxDropDownListComponent;

  // define variables for drop-down lists in the edit form
  source_sensorType: any;
  dataAdapter_sensorType: any;
  source_contract: any;
  dataAdapter_contract: any;

  contractIdIndex = 0;
  sensorTypeIdIndex = 0;

  // other variables
  saveSensor: Sensor = new Sensor();
  oSub: Subscription;
  typeEditWindow = '';

  constructor(private sensorService: SensorService) {
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  // updating data sources for drop-down lists in the form
  refresh_refbook() {
    this.source_contract =
      {
        datatype: 'array',
        localdata: this.contractSensors,
        id: 'contractId',
      };
    this.dataAdapter_contract = new jqx.dataAdapter(this.source_contract);

    this.source_sensorType =
      {
        datatype: 'array',
        localdata: this.sensorTypes,
        id: 'sensorTypeId',
      };
    this.dataAdapter_sensorType = new jqx.dataAdapter(this.source_sensorType);
  }

  // define default values for the form
  define_defaultvalues(saveSensor: Sensor) {
    if (this.typeEditWindow === 'upd') {
      this.saveSensor = saveSensor;
      // determine the desired positions in the drop-down lists
      for (let i = 0; i < this.contractSensors.length; i++) {
        if (this.contractSensors[i].id === this.saveSensor.contractId) {
          this.contractIdIndex = i;
          break;
        }
      }
      for (let i = 0; i < this.sensorTypes.length; i++) {
        if (this.sensorTypes[i].id === this.saveSensor.sensorTypeId) {
          this.sensorTypeIdIndex = i;
          break;
        }
      }
    }

    if (this.typeEditWindow === 'ins') {
      this.contractIdIndex = 0;
      this.sensorTypeIdIndex = 0;
      this.saveSensor.nodeId = !isUndefined(saveSensor.nodeId) && saveSensor.nodeId > 0 ? saveSensor.nodeId : 1;
      this.saveSensor.serialNumber = null;
      this.saveSensor.comment = 'пусто';
    }
  }

  // perform insert/update fixture
  saveBtn() {
    this.saveSensor.contractId = this.contractId.val();
    this.saveSensor.sensorTypeId = this.sensorTypeId.val();

    if (this.typeEditWindow === 'ins') {
      this.oSub = this.sensorService.ins(this.saveSensor).subscribe(
        response => {
          this.saveSensor.sensorId = +response;
          MaterialService.toast(`Датчик c id = ${this.saveSensor.sensorId} был добавлен.`);
        },
        error => MaterialService.toast(error.error.message),
        () => {
          // close edit window
          this.hideWindow();
          // update data source
          this.onSaveEditwinBtn.emit();
        }
      );
    }
    if (this.typeEditWindow === 'upd') {
      this.oSub = this.sensorService.upd(this.saveSensor).subscribe(
        response => {
          MaterialService.toast(`Датчик c id = ${this.saveSensor.sensorId} был обновлен.`);
        },
        error => MaterialService.toast(error.error.message),
        () => {
          // close edit window
          this.hideWindow();
          // update data sourceб
          this.onSaveEditwinBtn.emit();
        }
      );
    }
  }

  cancelBtn() {
    // this.onCancelEditwinBtn.emit()
    this.hideWindow();
  }

  openWindow(saveSensor: Sensor, typeEditWindow: string) {
    this.typeEditWindow = typeEditWindow;
    this.refresh_refbook();
    this.define_defaultvalues(saveSensor);
    this.editWindow.open();
  }

  destroyWindow() {
    this.editWindow.destroy();
  }

  hideWindow() {
    this.editWindow.hide();
  }

  positionWindow(coord: any) {
    this.editWindow.position({x: coord.x, y: coord.y});
  }

}
