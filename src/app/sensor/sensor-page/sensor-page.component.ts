import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';

import {Contract, Geograph, Owner, EquipmentType, SettingButtonPanel} from '../../shared/interfaces';
import {GeographService} from '../../shared/services/geograph/geograph.service';
import {ContractSensorService} from '../../shared/services/sensor/contractSensor.service';
import {OwnerSensorService} from '../../shared/services/sensor/ownerSensor';
import {SensorTypeService} from '../../shared/services/sensor/sensorType.service';
import {SensorlistPageComponent} from './sensor-md-page/sensorlist-page/sensorlist-page.component';


@Component({
  selector: 'app-sensor-page',
  templateUrl: './sensor-page.component.html',
  styleUrls: ['./sensor-page.component.css']
})
export class SensorPageComponent implements OnInit, OnDestroy {

  // define variables - link to view objects
  @ViewChild('sensorlistPageComponent') sensorlistPageComponent: SensorlistPageComponent;

  // sensor subscription
  geographSub: Subscription;
  ownerSensorSub: Subscription;
  sensorTypeSub: Subscription;
  contractSensorSub: Subscription;

  // sensor source
  geographs: Geograph[];
  ownerSensors: Owner[];
  sensorTypes: EquipmentType[];
  contractSensors: Contract[];

  // other variables
  settingSensorButtonPanel: SettingButtonPanel;

  constructor(
    // sensor service
    private geographService: GeographService,
    private ownerSensorService: OwnerSensorService,
    private sensorTypeService: SensorTypeService,
    private contractSensorService: ContractSensorService,
  ) {
  }

  ngOnInit() {
    this.fetch_refbook();

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
      filterNone: {
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
    // sensor subscription
    this.geographSub.unsubscribe();
    this.ownerSensorSub.unsubscribe();
    this.sensorTypeSub.unsubscribe();
    this.contractSensorSub.unsubscribe();
  }

  fetch_refbook() {
    // sensor refbook
    this.geographSub = this.geographService.fetch().subscribe(geographs => this.geographs = geographs);
    this.ownerSensorSub = this.ownerSensorService.fetch().subscribe(owners => this.ownerSensors = owners);
    this.sensorTypeSub = this.sensorTypeService.fetch().subscribe(sensorTypes => this.sensorTypes = sensorTypes);
    this.contractSensorSub = this.contractSensorService.fetch().subscribe(contracts => this.contractSensors = contracts);
  }

}
