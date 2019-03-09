import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

import {FixturelistPageComponent} from "../../../fixture/fixture-page/fixture-masterdetails-page/fixturelist-page/fixturelist-page.component";
import {
  Contract,
  FilterFixture, FilterGateway,
  FilterNode, FixtureType,
  Geograph, HeightType, Installer,
  NodeType,
  Owner_fixture, Owner_gateway,
  Owner_node, Substation
} from "../../../shared/interfaces";
import {GatewaylistPageComponent} from "./gatewaylist-page/gatewaylist-page.component";
import {NodelistPageComponent} from "../../../node/node-page/node-masterdetails-page/nodelist-page/nodelist-page.component";

@Component({
  selector: 'app-gateway-masterdetails-page',
  templateUrl: './gateway-masterdetails-page.component.html',
  styleUrls: ['./gateway-masterdetails-page.component.css']
})
export class GatewayMasterdetailsPageComponent implements OnInit {

  //variables from master component
  //gateway source
  @Input() geographs: Geograph[]
  @Input() owner_gateways: Owner_gateway[]
  @Input() gatewayTypes: NodeType[]
  @Input() contract_gateways: Contract[]

  //node source
  @Input() owner_nodes: Owner_node[]
  @Input() nodeTypes: NodeType[]
  @Input() contract_nodes: Contract[]
  @Input() nodeSortcolumn: any[]
  @Input() nodeColumns: any[]
  @Input() nodeListBoxSource: any[]

  //determine the functions that need to be performed in the parent component
  @Output() onRefreshMap = new EventEmitter()

  //define variables - link to view objects
  @ViewChild("id_gateway_select") id_gateway_select: number = -2;
  @ViewChild("gatewaylistPageComponent") gatewaylistPageComponent: GatewaylistPageComponent;
  @ViewChild("nodelistPageComponent") nodelistPageComponent: NodelistPageComponent;

  //other variables
  filterGateway: FilterGateway = {
    id_geograph: -1,
    id_owner: -1,
    id_gateway_type: -1,
    id_contract: -1,
    id_node: -1
  }
  filterNode: FilterNode = {
    id_geograph: -1,
    id_owner: -1,
    id_node_type: -1,
    id_contract: -1,
    id_gateway: -1
  }

  constructor() { }

  ngOnInit() {
    this.id_gateway_select = -2
  }

  refreshGrid() {
    this.gatewaylistPageComponent.applyFilter(this.filterGateway)
    this.refreshChildGrid(0)
  }

  refreshMap() {
    //make flag to refresh map
    this.onRefreshMap.emit()
  }

  refreshChildGrid(id_gateway: number) {
    //refresh child grid
    this.id_gateway_select = id_gateway
    this.filterNode.id_gateway = id_gateway
    this.nodelistPageComponent.applyFilter(this.filterNode)
  }

}
