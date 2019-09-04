// angular lib
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {isUndefined} from 'util';
// jqwidgets
import {jqxSplitterComponent} from 'jqwidgets-scripts/jqwidgets-ng/jqxsplitter';
// app interfaces
import {Contract, Owner, EquipmentType, FilterGateway, FilterNode, SettingButtonPanel, NavItem} from '../../../shared/interfaces';
// app services
// app components
import {GatewaylistPageComponent} from './gatewaylist-page/gatewaylist-page.component';
import {NodelistPageComponent} from '../../node-page/node-masterdetails-page/nodelist-page/nodelist-page.component';


@Component({
  selector: 'app-gateway-masterdetails-page',
  templateUrl: './gateway-masterdetails-page.component.html',
  styleUrls: ['./gateway-masterdetails-page.component.css']
})
export class GatewayMasterdetailsPageComponent implements OnInit {

  // variables from parent component
  @Input() siteMap: NavItem[];
  // gateway source
  @Input() ownerGateways: Owner[];
  @Input() gatewayTypes: EquipmentType[];
  @Input() contractGateways: Contract[];
  // node source
  @Input() ownerNodes: Owner[];
  @Input() nodeTypes: EquipmentType[];
  @Input() contractNodes: Contract[];

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('gatewaylistPageComponent', {static: false}) gatewaylistPageComponent: GatewaylistPageComponent;
  @ViewChild('nodelistPageComponent', {static: false}) nodelistPageComponent: NodelistPageComponent;
  @ViewChild('mainSplitter', {static: false}) mainSplitter: jqxSplitterComponent;

  // other variables
  selectGatewayId = 0;
  filterGateway: FilterGateway = {
    geographId: '',
    ownerId: '',
    gatewayTypeId: '',
    contractId: '',
    nodeId: ''
  };
  filterNode: FilterNode = {
    geographId: '',
    ownerId: '',
    nodeTypeId: '',
    contractId: '',
    gatewayId: '',
  };
  heightDeltaParentGrid = 55;
  heightDeltaChildGrid = 103;
  sizeParentSplitter: any;
  sizeChildSplitter: any;
  settingNodeButtonPanel: SettingButtonPanel;
  settingGatewayButtonPanel: SettingButtonPanel;

  constructor() {
  }

  ngOnInit() {
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
    this.settingNodeButtonPanel = {
      add: {
        visible: false,
        disabled: false,
      },
      upd: {
        visible: false,
        disabled: false,
      },
      del: {
        visible: false,
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
        visible: false,
        disabled: false,
      },
      pinDrop: {
        visible: false,
        disabled: false,
      },
      groupIn: {
        visible: true,
        disabled: false,
      },
      groupOut: {
        visible: true,
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
    this.gatewaylistPageComponent.applyFilter(this.filterGateway);
    this.refreshChildGrid(0);
  }

  refreshChildGrid(gatewayId: number) {
    this.selectGatewayId = gatewayId;
    this.filterNode.gatewayId = gatewayId.toString();
    if (gatewayId === 0) {
      if (!isUndefined(this.nodelistPageComponent)) {
        this.nodelistPageComponent.items = [];
        if (!isUndefined(this.nodelistPageComponent.jqxgridComponent)) {
          this.nodelistPageComponent.jqxgridComponent.empty_jqxgGrid();
        }
        this.nodelistPageComponent.getDisabledButtons();
      }
    } else {
      if (!isUndefined(this.nodelistPageComponent)) {
        this.nodelistPageComponent.applyFilter(this.filterNode);
      }
    }
  }

  resize(sizeParent: any, sizeChild: any) {
    const sizeParentGrid = sizeParent - this.heightDeltaParentGrid;
    const sizeChildGrid = sizeChild - this.heightDeltaChildGrid;
    this.gatewaylistPageComponent.jqxgridComponent.myGrid.height(sizeParentGrid);
    this.gatewaylistPageComponent.sourceForJqxGrid.grid.height = sizeParentGrid;
    if (!isUndefined(this.nodelistPageComponent)) {
      this.nodelistPageComponent.jqxgridComponent.myGrid.height(sizeChildGrid);
      this.nodelistPageComponent.sourceForJqxGrid.grid.height = sizeChildGrid;
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
