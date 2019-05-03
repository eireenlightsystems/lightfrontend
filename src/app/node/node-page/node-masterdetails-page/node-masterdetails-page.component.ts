import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {isUndefined} from 'util';

import {jqxSplitterComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxsplitter';

import {FixturelistPageComponent
} from '../../../fixture/fixture-page/fixture-masterdetails-page/fixturelist-page/fixturelist-page.component';
import {
  Contract, Geograph, Owner, EquipmentType, HeightType, Installer, Substation,
  FilterFixture, FilterGateway,
  FilterNode, FilterSensor, SettingButtonPanel
} from '../../../shared/interfaces';
import {NodelistPageComponent} from './nodelist-page/nodelist-page.component';
import {
  GatewaylistPageComponent
} from '../../../gateway/gateway-page/gateway-masterdetails-page/gatewaylist-page/gatewaylist-page.component';
import {SensorlistPageComponent} from '../../../sensor/sensor-page/sensor-md-page/sensorlist-page/sensorlist-page.component';


@Component({
  selector: 'app-node-masterdetails-page',
  templateUrl: './node-masterdetails-page.component.html',
  styleUrls: ['./node-masterdetails-page.component.css']
})

export class NodeMasterdetailsPageComponent implements OnInit {

  // variables from master component

  // node source
  @Input() geographs: Geograph[];
  @Input() ownerNodes: Owner[];
  @Input() nodeTypes: EquipmentType[];
  @Input() contractNodes: Contract[];
  // fixture source
  @Input() ownerFixtures: Owner[];
  @Input() fixtureTypes: EquipmentType[];
  @Input() substations: Substation[];
  @Input() contractFixtures: Contract[];
  @Input() installers: Installer[];
  @Input() heightTypes: HeightType[];
  // gateway source
  @Input() ownerGateways: Owner[];
  @Input() gatewayTypes: EquipmentType[];
  @Input() contractGateways: Contract[];
  // sensor source
  @Input() ownerSensors: Owner[];
  @Input() sensorTypes: EquipmentType[];
  @Input() contractSensors: Contract[];

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshMap = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('selectNodeId') selectNodeId = 0;
  @ViewChild('nodelistPageComponent') nodelistPageComponent: NodelistPageComponent;
  @ViewChild('fixturelistPageComponent') fixturelistPageComponent: FixturelistPageComponent;
  @ViewChild('gatewaylistPageComponent') gatewaylistPageComponent: GatewaylistPageComponent;
  @ViewChild('sensorlistPageComponent') sensorlistPageComponent: SensorlistPageComponent;
  @ViewChild('mainSplitter') mainSplitter: jqxSplitterComponent;

  // other variables
  isTabFixture = false;
  isTabGateway = false;
  isTabSensor = false;

  settingNodeButtonPanel: SettingButtonPanel;
  settingFixtureButtonPanel: SettingButtonPanel;
  settingGatewayButtonPanel: SettingButtonPanel;
  settingSensorButtonPanel: SettingButtonPanel;

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

  heightDeltaParentGrid = 55;
  heightDeltaChildGrid = 103;
  sizeParentSplitter: any;
  sizeChildSplitter: any;


  constructor() {
  }

  ngOnInit() {
    this.selectNodeId = 0;
    this.isTabFixture = true;
    this.isTabGateway = false;
    this.isTabSensor = false;

    // init node button panel
    this.settingNodeButtonPanel = {
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

    // init fixture button panel
    this.settingFixtureButtonPanel = {
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
        visible: false,
        disabled: false,
      },
      filterNone: {
        visible: false,
        disabled: false,
      },
      filterList: {
        visible: false,
        disabled: false,
      },
      place: {
        visible: true,
        disabled: false,
      },
      pinDrop: {
        visible: true,
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

    // init gateway button panel
    this.settingGatewayButtonPanel = {
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
        visible: false,
        disabled: false,
      },
      filterNone: {
        visible: false,
        disabled: false,
      },
      filterList: {
        visible: false,
        disabled: false,
      },
      place: {
        visible: true,
        disabled: false,
      },
      pinDrop: {
        visible: true,
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
        visible: false,
        disabled: false,
      },
      filterNone: {
        visible: false,
        disabled: false,
      },
      filterList: {
        visible: false,
        disabled: false,
      },
      place: {
        visible: true,
        disabled: false,
      },
      pinDrop: {
        visible: true,
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

  resize(sizeParent: any, sizeChild: any) {
    const sizeParentGrid = sizeParent - this.heightDeltaParentGrid;
    const sizeChildGrid = sizeChild - this.heightDeltaChildGrid;

    this.nodelistPageComponent.jqxgridComponent.myGrid.height(sizeParentGrid);
    this.nodelistPageComponent.sourceForJqxGrid.grid.height = sizeParentGrid;

    if (!isUndefined(this.fixturelistPageComponent)) {
      this.fixturelistPageComponent.jqxgridComponent.myGrid.height(sizeChildGrid);
      this.fixturelistPageComponent.sourceForJqxGrid.grid.height = sizeChildGrid;
    }

    if (!isUndefined(this.gatewaylistPageComponent)) {
      this.gatewaylistPageComponent.jqxgridComponent.myGrid.height(sizeChildGrid);
      this.gatewaylistPageComponent.sourceForJqxGrid.grid.height = sizeChildGrid;
    }

    if (!isUndefined(this.sensorlistPageComponent)) {
      this.sensorlistPageComponent.jqxgridComponent.myGrid.height(sizeChildGrid);
      this.sensorlistPageComponent.sourceForJqxGrid.grid.height = sizeChildGrid;
    }
  }

  collapsed(sizeParent: any, sizeChild: any) {
    this.sizeParentSplitter = sizeParent;
    this.sizeChildSplitter = sizeChild;
    this.mainSplitter.attrPanels[0].size = this.getHeightSplitter();
  }

  expanded() {
    this.mainSplitter.attrPanels[0].size = this.sizeParentSplitter;
    this.mainSplitter.attrPanels[1].size = this.sizeChildSplitter;
  }

  getHeightSplitter() {
    return 790;
  }
}
