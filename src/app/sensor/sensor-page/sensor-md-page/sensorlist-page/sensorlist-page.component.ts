import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/index';

import {Geograph, Contract, Owner, FilterSensor, EquipmentType, Sensor, SourceForFilter} from '../../../../shared/interfaces';
import {SensorService} from '../../../../shared/services/sensor/sensor.service';
import {SensorlistJqxgridComponent} from './sensorlist-jqxgrid/sensorlist-jqxgrid.component';


const STEP = 1000000000000;


@Component({
  selector: 'app-sensorlist-page',
  templateUrl: './sensorlist-page.component.html',
  styleUrls: ['./sensorlist-page.component.css']
})
export class SensorlistPageComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() geographs: Geograph[];
  @Input() ownerSensors: Owner[];
  @Input() sensorTypes: EquipmentType[];
  @Input() contractSensors: Contract[];

  @Input() nodeSelectId: number;

  @Input() heightGrid: number;
  @Input() isMasterGrid: boolean;
  @Input() selectionmode: string;

  @Input() isAdd: boolean;
  @Input() isUpdate: boolean;
  @Input() isDelete: boolean;
  @Input() isRefresh: boolean;
  @Input() isFilter_none: boolean;
  @Input() isFilter_list: boolean;
  @Input() isPlace: boolean;
  @Input() isPin_drop: boolean;

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshChildGrid = new EventEmitter<number>();
  @Output() onRefreshMap = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('sensorlistJqxgridComponent') sensorlistJqxgridComponent: SensorlistJqxgridComponent;

  // other variables
  sensors: Sensor[] = [];
  filter: FilterSensor = {
    geographId: '',
    ownerId: '',
    sensorTypeId: '',
    contractId: '',
    nodeId: ''
  };
  sourceForFilter: SourceForFilter[];
  oSub: Subscription;
  isFilterVisible = false;
  //
  offset = 0;
  limit = STEP;
  //
  loading = false;
  reloading = false;
  noMoreNodes = false;
  //
  sensorSelectId = 0;
  //
  isAddBtnDisabled: boolean;
  isEditBtnDisabled: boolean;
  isDeleteBtnDisabled: boolean;
  isRefreshBtnDisabled: boolean;
  isFilter_noneBtnDisabled: boolean;
  isFilter_listBtnDisabled: boolean;
  isPlaceBtnDisabled: boolean;
  isPin_dropBtnDisabled: boolean;

  constructor(private sensorService: SensorService) {
  }

  ngOnInit() {
    // if this.node is child grid, then we need update this.filter.nodeId
    if (!this.isMasterGrid) {
      this.filter.nodeId = this.nodeSelectId.toString();
    }

    // Definde filter
    this.sourceForFilter = [
      {
        name: 'geographs',
        type: 'jqxComboBox',
        source: this.geographs,
        theme: 'material',
        width: '300',
        height: '43',
        placeHolder: 'Геогр. понятие:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      },
      {
        name: 'ownerSensors',
        type: 'jqxComboBox',
        source: this.ownerSensors,
        theme: 'material',
        width: '300',
        height: '43',
        placeHolder: 'Владелец:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      },
      {
        name: 'sensorTypes',
        type: 'jqxComboBox',
        source: this.sensorTypes,
        theme: 'material',
        width: '300',
        height: '43',
        placeHolder: 'Тип датчика:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      }
    ];

    this.getAll();
    this.reloading = true;
  }

  ngOnDestroy() {
    this.oSub.unsubscribe();
  }

  refreshGrid() {
    this.sensors = [];
    this.getAll();
    this.reloading = true;
    this.sensorSelectId = 0;

    // if this.nodes id master grid, then we need refresh child grid
    if (this.isMasterGrid) {
      this.refreshChildGrid(this.sensorSelectId);
    }

    // refresh map
    this.onRefreshMap.emit();
  }

  refreshChildGrid(sensorId: number) {
    this.sensorSelectId = sensorId;
    // refresh child grid
    this.onRefreshChildGrid.emit(sensorId);
  }

  getAll() {
    // Disabled/available buttons
    if (!this.isMasterGrid && +this.filter.nodeId <= 0) {
      this.isAddBtnDisabled = true;
      this.isEditBtnDisabled = true;
      this.isDeleteBtnDisabled = true;
      this.isRefreshBtnDisabled = true;
      this.isFilter_noneBtnDisabled = true;
      this.isFilter_listBtnDisabled = true;
      this.isPlaceBtnDisabled = true;
      this.isPin_dropBtnDisabled = true;
    } else {
      this.isAddBtnDisabled = false;
      this.isEditBtnDisabled = false;
      this.isDeleteBtnDisabled = false;
      this.isRefreshBtnDisabled = false;
      this.isFilter_noneBtnDisabled = false;
      this.isFilter_listBtnDisabled = false;
      this.isPlaceBtnDisabled = false;
      this.isPin_dropBtnDisabled = false;
    }

    const params = Object.assign({}, {
        offset: this.offset,
        limit: this.limit
      },
      this.filter);

    this.oSub = this.sensorService.getAll(params).subscribe(sensors => {
      this.sensors = this.sensors.concat(sensors);
      this.noMoreNodes = sensors.length < STEP;
      this.loading = false;
      this.reloading = false;
    });
  }

  loadMore() {
    this.offset += STEP;
    this.loading = true;
    this.getAll();
  }

  applyFilter(filter: FilterSensor) {
    this.sensors = [];
    this.offset = 0;
    this.filter = filter;
    this.reloading = true;
    this.getAll();
  }

  applyFilterFromFilter(event: any) {
    this.sensors = [];
    this.offset = 0;
    this.reloading = true;
    for (let i = 0; i < event.length; i++) {
      switch (event[i].name) {
        case 'geographs':
          this.filter.geographId = event[i].id;
          break;
        case 'ownerSensors':
          this.filter.ownerId = event[i].id;
          break;
        case 'sensorTypes':
          this.filter.sensorTypeId = event[i].id;
          break;
        default:
          break;
      }
    }
    this.getAll();
  }

  initSourceFilter() {
    for (let i = 0; i < this.sourceForFilter.length; i++) {
      switch (this.sourceForFilter[i].name) {
        case 'geographs':
          this.sourceForFilter[i].source = this.geographs;
          break;
        case 'ownerSensors':
          this.sourceForFilter[i].source = this.ownerSensors;
          break;
        case 'sensorTypes':
          this.sourceForFilter[i].source = this.sensorTypes;
          break;
        default:
          break;
      }
    }
  }

  ins() {
    this.sensorlistJqxgridComponent.ins();
  }

  upd() {
    this.sensorlistJqxgridComponent.upd();
  }

  del() {
    this.sensorlistJqxgridComponent.del();
  }

  place() {
    this.sensorlistJqxgridComponent.place();
  }

  pin_drop() {
    this.sensorlistJqxgridComponent.pin_drop();
  }
}
