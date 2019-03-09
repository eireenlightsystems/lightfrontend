import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

import {FixturelistPageComponent} from "../../../fixture/fixture-page/fixture-masterdetails-page/fixturelist-page/fixturelist-page.component";
import {
  Contract,
  FilterFixture, FilterGateway,
  FilterNode, FixtureType, GatewayType,
  Geograph, HeightType, Installer,
  NodeType,
  Owner_fixture, Owner_gateway,
  Owner_node, Substation
} from "../../../shared/interfaces";
import {NodelistPageComponent} from "./nodelist-page/nodelist-page.component";
import {GatewaylistPageComponent} from "../../../gateway/gateway-page/gateway-masterdetails-page/gatewaylist-page/gatewaylist-page.component";


@Component({
  selector: 'app-node-masterdetails-page',
  templateUrl: './node-masterdetails-page.component.html',
  styleUrls: ['./node-masterdetails-page.component.css']
})

export class NodeMasterdetailsPageComponent implements OnInit {

  //variables from master component
  @Input() isAdd: boolean
  @Input() isUpdate: boolean
  @Input() isDelete: boolean
  @Input() isRefresh: boolean
  @Input() isFilter_none: boolean
  @Input() isFilter_list: boolean
  @Input() isPlace: boolean
  @Input() isPin_drop: boolean

  //node source
  @Input() geographs: Geograph[]
  @Input() owner_nodes: Owner_node[]
  @Input() nodeTypes: NodeType[]
  @Input() contract_nodes: Contract[]
  //fixture source
  @Input() owner_fixtures: Owner_fixture[]
  @Input() fixtureTypes: FixtureType[]
  @Input() substations: Substation[]
  @Input() contract_fixtures: Contract[]
  @Input() installers: Installer[]
  @Input() heightTypes: HeightType[]
  //gateway source
  @Input() owner_gateways: Owner_gateway[]
  @Input() gatewayTypes: GatewayType[]
  @Input() contract_gateways: Contract[]

  //determine the functions that need to be performed in the parent component
  @Output() onRefreshMap = new EventEmitter()

  //define variables - link to view objects
  @ViewChild("id_node_select") id_node_select: number = -2;
  @ViewChild("nodelistPageComponent") nodelistPageComponent: NodelistPageComponent;
  @ViewChild("fixturelistPageComponent") fixturelistPageComponent: FixturelistPageComponent;
  @ViewChild("gatewaylistPageComponent") gatewaylistPageComponent: GatewaylistPageComponent;

  //other variables
  isTabFixture: boolean = false
  isTabGateway: boolean = false
  isTabSensor: boolean = false
  filterNode: FilterNode = {
    id_geograph: -1,
    id_owner: -1,
    id_node_type: -1,
    id_contract: -1,
    id_gateway: -1
  }
  filterFixture: FilterFixture = {
    id_geograph: -1,
    id_owner: -1,
    id_fixture_type: -1,
    id_substation: -1,
    id_mode: -1,

    id_contract: -1,
    id_node: -1
  }
  filterGateway: FilterGateway = {
    id_geograph: -1,
    id_owner: -1,
    id_gateway_type: -1,
    id_contract: -1,
    id_node: -1
  }
  //define columns for table Node
  nodeSortcolumn: string[] = ['id_node']
  nodeColumns: any[] =
    [
      {text: 'id_node', datafield: 'id_node', width: 150},
      {text: 'Договор', datafield: 'code_contract', width: 150},
      {text: 'Географическое понятие', datafield: 'code_geograph', width: 150},
      {text: 'Тип узла', datafield: 'code_node_type', width: 150},
      {text: 'Владелец', datafield: 'code_owner', width: 150},

      {text: 'Номер узла в группе', datafield: 'num_node', width: 150},

      {text: 'Широта', datafield: 'n_coordinate', width: 150},
      {text: 'Долгота', datafield: 'e_coordinate', width: 150},

      {text: 'Цена', datafield: 'price', width: 150},
      {text: 'Коментарий', datafield: 'comments', width: 150},
      {text: 'Дата (редак.)', datafield: 'dateedit', width: 150},
      {text: 'Польз-ль (редак.)', datafield: 'useredit', width: 150}
    ];

  //define a data source for filtering table columns Node
  nodeListBoxSource: any[] =
    [
      {label: 'id_node', value: 'id_node', checked: true},
      {label: 'Договор', value: 'code_contract', checked: true},
      {label: 'Географическое понятие', value: 'code_geograph', checked: true},
      {label: 'Тип узла', value: 'code_node_type', checked: true},
      {label: 'Владелец', value: 'code_owner', checked: true},

      {label: 'Номер узла в группе', value: 'num_node', checked: true},

      {label: 'Широта', value: 'n_coordinate', checked: true},
      {label: 'Долгота', value: 'e_coordinate', checked: true},

      {label: 'Цена', value: 'price', checked: false},
      {label: 'Коментарий', value: 'comments', checked: false},
      {label: 'Дата (редак.)', value: 'dateedit', checked: false},
      {label: 'Польз-ль (редак.)', value: 'useredit', checked: false}
    ];

  constructor() { }

  ngOnInit() {
    this.id_node_select = -2
    this.isTabFixture = true
    this.isTabGateway = false
    this.isTabSensor = false
  }

  refreshGrid() {
    this.nodelistPageComponent.applyFilter(this.filterNode)
    this.refreshChildGrid(0)
  }

  refreshMap() {
    //make flag to refresh map
    this.onRefreshMap.emit()
  }

  refreshChildGrid(id_node: number) {
    //refresh child grid
    this.id_node_select = id_node

    //fixture
    this.filterFixture.id_node = id_node
    if(this.isTabFixture)this.fixturelistPageComponent.applyFilter(this.filterFixture)

    //gateway
    this.filterGateway.id_node = id_node
    if(this.isTabGateway)this.gatewaylistPageComponent.applyFilter(this.filterGateway)
  }

  selected(event: any): void {
    if (event.args.item === 0) {
      this.isTabFixture = true
      this.isTabGateway = false
      this.isTabSensor = false
    }
    if (event.args.item === 1) {
      this.isTabFixture = false
      this.isTabGateway = true
      this.isTabSensor = false
    }
    if (event.args.item === 2) {
      this.isTabFixture = false
      this.isTabGateway = false
      this.isTabSensor = true
    }
  }
}
