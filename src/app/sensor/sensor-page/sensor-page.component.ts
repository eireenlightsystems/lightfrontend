import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';

import {Contract, Geograph, OwnerSensor, SensorType} from '../../shared/interfaces';
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
  ownerSensors: OwnerSensor[];
  sensorTypes: SensorType[];
  contractSensors: Contract[];

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
