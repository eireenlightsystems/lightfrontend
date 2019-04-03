import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

import {FixturelistPageComponent} from '../../../fixture/fixture-page/fixture-masterdetails-page/fixturelist-page/fixturelist-page.component';
import {
  Contract,
  FilterFixture, FilterGateway,
  FilterNode, FilterSensor, FixtureType, GatewayType,
  Geograph, HeightType, Installer,
  NodeType,
  OwnerFixture, OwnerGateway,
  OwnerNode, OwnerSensor, SensorType, Substation
} from '../../../shared/interfaces';
import {NodelistPageComponent} from './nodelist-page/nodelist-page.component';
import {GatewaylistPageComponent} from '../../../gateway/gateway-page/gateway-masterdetails-page/gatewaylist-page/gatewaylist-page.component';
import {SensorlistPageComponent} from '../../../sensor/sensor-page/sensor-md-page/sensorlist-page/sensorlist-page.component';


@Component({
  selector: 'app-node-masterdetails-page',
  templateUrl: './node-masterdetails-page.component.html',
  styleUrls: ['./node-masterdetails-page.component.css']
})

export class NodeMasterdetailsPageComponent implements OnInit {

  // variables from master component
  @Input() isAdd: boolean;
  @Input() isUpdate: boolean;
  @Input() isDelete: boolean;
  @Input() isRefresh: boolean;
  @Input() isFilter_none: boolean;
  @Input() isFilter_list: boolean;
  @Input() isPlace: boolean;
  @Input() isPin_drop: boolean;

  // node source
  @Input() geographs: Geograph[];
  @Input() ownerNodes: OwnerNode[];
  @Input() nodeTypes: NodeType[];
  @Input() contractNodes: Contract[];
  // fixture source
  @Input() ownerFixtures: OwnerFixture[];
  @Input() fixtureTypes: FixtureType[];
  @Input() substations: Substation[];
  @Input() contractFixtures: Contract[];
  @Input() installers: Installer[];
  @Input() heightTypes: HeightType[];
  // gateway source
  @Input() ownerGateways: OwnerGateway[];
  @Input() gatewayTypes: GatewayType[];
  @Input() contractGateways: Contract[];
  // sensor source
  @Input() ownerSensors: OwnerSensor[];
  @Input() sensorTypes: SensorType[];
  @Input() contractSensors: Contract[];

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshMap = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('selectNodeId') selectNodeId = 0;
  @ViewChild('nodelistPageComponent') nodelistPageComponent: NodelistPageComponent;
  @ViewChild('fixturelistPageComponent') fixturelistPageComponent: FixturelistPageComponent;
  @ViewChild('gatewaylistPageComponent') gatewaylistPageComponent: GatewaylistPageComponent;
  @ViewChild('sensorlistPageComponent') sensorlistPageComponent: SensorlistPageComponent;

  // other variables
  isTabFixture = false;
  isTabGateway = false;
  isTabSensor = false;
  filterNode: FilterNode = {
    geographId: '',
    ownerId: '',
    nodeTypeId: '',
    contractId: '',
    gatewayId: ''
  };
  filterFixture: FilterFixture = {
    geographId: '',
    ownerId: '',
    fixtureTypeId: '',
    substationId: '',
    modeId: '',

    contractId: '',
    nodeId: ''
  };
  filterGateway: FilterGateway = {
    geographId: '',
    ownerId: '',
    gatewayTypeId: '',
    contractId: '',
    nodeId: ''
  };
  filterSensor: FilterSensor = {
    geographId: '',
    ownerId: '',
    sensorTypeId: '',
    contractId: '',
    nodeId: ''
  };

  // define columns for table Node
  nodeSortcolumn: string[] = ['nodeId'];
  nodeColumns: any[] =
    [
      {text: 'nodeId', datafield: 'nodeId', width: 150},
      {text: 'Договор', datafield: 'contractCode', width: 150},
      {text: 'Географическое понятие', datafield: 'geographCode', width: 150},
      {text: 'Тип узла', datafield: 'nodeTypeCode', width: 150},
      {text: 'Владелец', datafield: 'ownerCode', width: 150},

      {text: 'Широта', datafield: 'n_coordinate', width: 150},
      {text: 'Долгота', datafield: 'e_coordinate', width: 150},

      {text: 'Серийный номер', datafield: 'serialNumber', width: 150},
      {text: 'Коментарий', datafield: 'comment', width: 150},
    ];

  // define a data source for filtering table columns Node
  nodeListBoxSource: any[] =
    [
      {label: 'nodeId', value: 'nodeId', checked: true},
      {label: 'Договор', value: 'contractCode', checked: true},
      {label: 'Географическое понятие', value: 'geographCode', checked: true},
      {label: 'Тип узла', value: 'nodeTypeCode', checked: true},
      {label: 'Владелец', value: 'ownerCode', checked: true},

      {label: 'Широта', value: 'n_coordinate', checked: true},
      {label: 'Долгота', value: 'e_coordinate', checked: true},

      {label: 'Серийный номер', value: 'serialNumber', checked: true},
      {label: 'Коментарий', value: 'comment', checked: true},
    ];

  constructor() {
  }

  ngOnInit() {
    this.selectNodeId = 0;
    this.isTabFixture = true;
    this.isTabGateway = false;
    this.isTabSensor = false;
  }

  refreshGrid() {
    this.nodelistPageComponent.applyFilter(this.filterNode);
    this.refreshChildGrid(0);
  }

  refreshMap() {
    // make flag to refresh map
    this.onRefreshMap.emit();
  }

  refreshChildGrid(id_node: number) {
    // refresh child grid
    this.selectNodeId = id_node;

    // fixture
    this.filterFixture.nodeId = id_node.toString();
    if (this.isTabFixture) {
      this.fixturelistPageComponent.applyFilter(this.filterFixture);
    }

    // gateway
    this.filterGateway.nodeId = id_node.toString();
    if (this.isTabGateway) {
      this.gatewaylistPageComponent.applyFilter(this.filterGateway);
    }

    // sensor
    this.filterSensor.nodeId = id_node.toString();
    if (this.isTabSensor) {
      this.sensorlistPageComponent.applyFilter(this.filterSensor);
    }
  }

  selected(event: any): void {
    if (event.args.item === 0) {
      this.isTabFixture = true;
      this.isTabGateway = false;
      this.isTabSensor = false;
    }
    if (event.args.item === 1) {
      this.isTabFixture = false;
      this.isTabGateway = true;
      this.isTabSensor = false;
    }
    if (event.args.item === 2) {
      this.isTabFixture = false;
      this.isTabGateway = false;
      this.isTabSensor = true;
    }
  }
}
