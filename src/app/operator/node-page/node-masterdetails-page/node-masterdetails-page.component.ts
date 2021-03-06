// angular lib
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {isUndefined} from 'util';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
import {jqxSplitterComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxsplitter';
// app interfaces
import {
  Contract, Owner, EquipmentType, HeightType, Installer, Substation,
  FilterFixture, FilterGateway,
  FilterNode, FilterSensor, SettingButtonPanel, NavItem, NodeType, FixtureType, GatewayType, SensorType
} from '../../../shared/interfaces';
// app services
// app components
import {
  FixturelistPageComponent
} from '../../fixture-page/fixture-masterdetails-page/fixturelist-page/fixturelist-page.component';
import {NodelistPageComponent} from './nodelist-page/nodelist-page.component';
import {
  GatewaylistPageComponent
} from '../../gateway-page/gateway-masterdetails-page/gatewaylist-page/gatewaylist-page.component';
import {SensorlistPageComponent} from '../../sensor-page/sensor-md-page/sensorlist-page/sensorlist-page.component';


@Component({
  selector: 'app-node-masterdetails-page',
  templateUrl: './node-masterdetails-page.component.html',
  styleUrls: ['./node-masterdetails-page.component.css']
})

export class NodeMasterdetailsPageComponent implements OnInit {

  // variables from parent component
  @Input() siteMap: NavItem[];
  // node source
  @Input() ownerNodes: Owner[];
  @Input() nodeTypes: NodeType[];
  @Input() contractNodes: Contract[];
  // fixture source
  @Input() ownerFixtures: Owner[];
  @Input() fixtureTypes: FixtureType[];
  @Input() substations: Substation[];
  @Input() contractFixtures: Contract[];
  @Input() installers: Installer[];
  @Input() heightTypes: HeightType[];
  // gateway source
  @Input() ownerGateways: Owner[];
  @Input() gatewayTypes: GatewayType[];
  @Input() contractGateways: Contract[];
  // sensor source
  @Input() ownerSensors: Owner[];
  @Input() sensorTypes: SensorType[];
  @Input() contractSensors: Contract[];

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('nodelistPageComponent', {static: false}) nodelistPageComponent: NodelistPageComponent;
  @ViewChild('fixturelistPageComponent', {static: false}) fixturelistPageComponent: FixturelistPageComponent;
  @ViewChild('gatewaylistPageComponent', {static: false}) gatewaylistPageComponent: GatewaylistPageComponent;
  @ViewChild('sensorlistPageComponent', {static: false}) sensorlistPageComponent: SensorlistPageComponent;
  @ViewChild('mainSplitter', {static: false}) mainSplitter: jqxSplitterComponent;

  // other variables
  selectNodeId = 0;
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


  constructor(// service
    public translate: TranslateService) {
  }

  ngOnInit() {
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
      setting: {
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
      setting: {
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
      setting: {
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

  refreshChildGrid(id_node: number) {
    this.selectNodeId = id_node;
    this.filterFixture.nodeId = id_node.toString();
    this.filterGateway.nodeId = id_node.toString();
    this.filterSensor.nodeId = id_node.toString();
    if (id_node === 0) {
      // fixture
      if (!isUndefined(this.fixturelistPageComponent)) {
        this.fixturelistPageComponent.items = [];
        if (!isUndefined(this.fixturelistPageComponent.jqxgridComponent)) {
          this.fixturelistPageComponent.jqxgridComponent.empty_jqxgGrid();
        }
        this.fixturelistPageComponent.getDisabledButtons();
      }
      // gateway
      if (!isUndefined(this.gatewaylistPageComponent)) {
        this.gatewaylistPageComponent.items = [];
        if (!isUndefined(this.gatewaylistPageComponent.jqxgridComponent)) {
          this.gatewaylistPageComponent.jqxgridComponent.empty_jqxgGrid();
        }
        this.gatewaylistPageComponent.getDisabledButtons();
      }
      // sensor
      if (!isUndefined(this.sensorlistPageComponent)) {
        this.sensorlistPageComponent.items = [];
        if (!isUndefined(this.sensorlistPageComponent.jqxgridComponent)) {
          this.sensorlistPageComponent.jqxgridComponent.empty_jqxgGrid();
        }
        this.sensorlistPageComponent.getDisabledButtons();
      }
    } else {
      // fixture
      if (!isUndefined(this.fixturelistPageComponent)) {
        this.fixturelistPageComponent.applyFilter(this.filterFixture);
      }
      // gateway
      if (!isUndefined(this.gatewaylistPageComponent)) {
        this.gatewaylistPageComponent.applyFilter(this.filterGateway);
      }
      // sensor
      if (!isUndefined(this.sensorlistPageComponent)) {
        this.sensorlistPageComponent.applyFilter(this.filterSensor);
      }
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
