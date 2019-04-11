import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';

import {Contract, Geograph, EquipmentType, Owner} from '../../shared/interfaces';
import {GeographService} from '../../shared/services/geograph/geograph.service';
import {OwnerNodeService} from '../../shared/services/node/ownerNode';
import {NodeTypeService} from '../../shared/services/node/nodeType.service';
import {ContractNodeService} from '../../shared/services/node/contractNode.service';
import {GatewayMasterdetailsPageComponent} from './gateway-masterdetails-page/gateway-masterdetails-page.component';
import {GatewaymapPageComponent} from './gatewaymap-page/gatewaymap-page.component';
import {ContractGatewayService} from '../../shared/services/gateway/contractGateway.service';
import {OwnerGatewayService} from '../../shared/services/gateway/ownerGateway';
import {GatewayTypeService} from '../../shared/services/gateway/gatewayType.service';

@Component({
  selector: 'app-gateway-page',
  templateUrl: './gateway-page.component.html',
  styleUrls: ['./gateway-page.component.css']
})
export class GatewayPageComponent implements OnInit, OnDestroy {

  // define variables - link to view objects
  @ViewChild('gatewayMasterdetailsPageComponent') gatewayMasterdetailsPageComponent: GatewayMasterdetailsPageComponent;
  @ViewChild('gatewaymapPageComponent') gatewaymapPageComponent: GatewaymapPageComponent;

  isSourceChangeTab0: boolean;
  isSourceChangeTab1: boolean;

  // gateway subscription
  geographSub: Subscription;
  ownerGatewaySub: Subscription;
  gatewayTypeSub: Subscription;
  contractGatewaySub: Subscription;

  // node subscription
  ownerNodeSub: Subscription;
  nodeTypeSub: Subscription;
  contractNodeSub: Subscription;

  // gateway source
  geographs: Geograph[];
  ownerGateways: Owner[];
  gatewayTypes: EquipmentType[];
  contractGateways: Contract[];

  // node source
  ownerNodes: Owner[];
  nodeTypes: EquipmentType[];
  contractNodes: Contract[];

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
      {label: 'Коментарий', value: 'comment', checked: false},
    ];

  constructor(
    // gateway service
    private geographService: GeographService,
    private ownerGatewayService: OwnerGatewayService,
    private gatewayTypeService: GatewayTypeService,
    private contract_gatewayService: ContractGatewayService,
    // node service
    private ownerNodeService: OwnerNodeService,
    private nodeTypeService: NodeTypeService,
    private contractNodeService: ContractNodeService
  ) {
  }

  ngOnInit() {
    this.isSourceChangeTab0 = false;
    this.isSourceChangeTab1 = false;
    this.fetch_refbook();
  }

  ngOnDestroy() {
    // gateway subscription
    this.geographSub.unsubscribe();
    this.ownerGatewaySub.unsubscribe();
    this.gatewayTypeSub.unsubscribe();
    this.contractGatewaySub.unsubscribe();

    // node subscription
    this.ownerNodeSub.unsubscribe();
    this.nodeTypeSub.unsubscribe();
    this.contractNodeSub.unsubscribe();

  }

  selected(event: any): void {
    if (event.args.item === 0 && this.isSourceChangeTab1) {
      this.refreshTab0();
    }
    if (event.args.item === 1 && this.isSourceChangeTab0) {
      this.refreshTab1();
    }
  }

  refreshTab0() {
    this.gatewayMasterdetailsPageComponent.refreshGrid();
    this.isSourceChangeTab1 = false;
  }

  refreshTab1() {
    this.gatewaymapPageComponent.refreshMap();
    this.isSourceChangeTab0 = false;
  }

  refreshGrid() {
    this.isSourceChangeTab1 = true;
  }

  refreshMap() {
    this.isSourceChangeTab0 = true;
  }

  fetch_refbook() {
    // gateway refbook
    this.geographSub = this.geographService.fetch().subscribe(geographs => this.geographs = geographs);
    this.ownerGatewaySub = this.ownerGatewayService.fetch().subscribe(owners => this.ownerGateways = owners);
    this.gatewayTypeSub = this.gatewayTypeService.fetch().subscribe(gatewayTypes => this.gatewayTypes = gatewayTypes);
    this.contractGatewaySub = this.contract_gatewayService.fetch().subscribe(contracts => this.contractGateways = contracts);

    // node refbook
    this.ownerNodeSub = this.ownerNodeService.fetch().subscribe(owners => this.ownerNodes = owners);
    this.nodeTypeSub = this.nodeTypeService.fetch().subscribe(nodeTypes => this.nodeTypes = nodeTypes);
    this.contractNodeSub = this.contractNodeService.fetch().subscribe(contracts => this.contractNodes = contracts);
  }

}
