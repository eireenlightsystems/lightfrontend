import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

import {Contract, Geograph, Owner, EquipmentType, FilterGateway, FilterNode} from '../../../shared/interfaces';
import {GatewaylistPageComponent} from './gatewaylist-page/gatewaylist-page.component';
import {NodelistPageComponent} from '../../../node/node-page/node-masterdetails-page/nodelist-page/nodelist-page.component';

@Component({
  selector: 'app-gateway-masterdetails-page',
  templateUrl: './gateway-masterdetails-page.component.html',
  styleUrls: ['./gateway-masterdetails-page.component.css']
})
export class GatewayMasterdetailsPageComponent implements OnInit {

  // variables from master component
  // gateway source
  @Input() geographs: Geograph[];
  @Input() ownerGateways: Owner[];
  @Input() gatewayTypes: EquipmentType[];
  @Input() contractGateways: Contract[];

  // node source
  @Input() ownerNodes: Owner[];
  @Input() nodeTypes: EquipmentType[];
  @Input() contractNodes: Contract[];
  @Input() nodeSortcolumn: any[];
  @Input() nodeColumns: any[];
  @Input() nodeListBoxSource: any[];

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshMap = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('selectGatewayId') selectGatewayId = 0;
  @ViewChild('gatewaylistPageComponent') gatewaylistPageComponent: GatewaylistPageComponent;
  @ViewChild('nodelistPageComponent') nodelistPageComponent: NodelistPageComponent;

  // other variables
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

  constructor() {
  }

  ngOnInit() {
    // this.selectGatewayId = 0;
  }

  refreshGrid() {
    this.gatewaylistPageComponent.applyFilter(this.filterGateway);
    this.refreshChildGrid(0);
  }

  refreshMap() {
    // make flag to refresh map
    this.onRefreshMap.emit();
  }

  refreshChildGrid(gatewayId: number) {
    // refresh child grid
    this.selectGatewayId = gatewayId;
    this.filterNode.gatewayId = gatewayId.toString();
    this.nodelistPageComponent.applyFilter(this.filterNode);
  }

}
