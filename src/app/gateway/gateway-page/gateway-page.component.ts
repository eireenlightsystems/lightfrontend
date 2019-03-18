import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';

import {
  Contract,
  GatewayType,
  Geograph,
  NodeType,
  Owner_gateway,
  Owner_node
} from '../../shared/interfaces';
import {GeographService} from '../../shared/services/geograph/geograph.service';
import {Owner_nodeService} from '../../shared/services/node/owner_node';
import {NodeTypeService} from '../../shared/services/node/nodeType.service';
import {Contract_nodeService} from '../../shared/services/node/contract_node.service';
import {GatewayMasterdetailsPageComponent} from './gateway-masterdetails-page/gateway-masterdetails-page.component';
import {GatewaymapPageComponent} from './gatewaymap-page/gatewaymap-page.component';
import {Contract_gatewayService} from '../../shared/services/gateway/contract_gateway.service';
import {Owner_gatewayService} from '../../shared/services/gateway/owner_gateway';
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
  owner_gatewaySub: Subscription;
  gatewayTypeSub: Subscription;
  contract_gatewaySub: Subscription;

  // node subscription
  owner_nodeSub: Subscription;
  nodeTypeSub: Subscription;
  contract_nodeSub: Subscription;

  // gateway source
  geographs: Geograph[];
  owner_gateways: Owner_gateway[];
  gatewayTypes: GatewayType[];
  contract_gateways: Contract[];

  // node source
  owner_nodes: Owner_node[];
  nodeTypes: NodeType[];
  contract_nodes: Contract[];

  // define columns for table Node
  nodeSortcolumn: string[] = ['num_node'];
  nodeColumns: any[] =
    [
      {text: 'id_node', datafield: 'id_node', width: 150},

      {text: 'Номер узла в группе', datafield: 'num_node', width: 150},

      {text: 'Договор', datafield: 'code_contract', width: 150},
      {text: 'Географическое понятие', datafield: 'code_geograph', width: 150},
      {text: 'Тип узла', datafield: 'code_node_type', width: 150},
      {text: 'Владелец', datafield: 'code_owner', width: 150},

      {text: 'Широта', datafield: 'n_coordinate', width: 150},
      {text: 'Долгота', datafield: 'e_coordinate', width: 150},

      {text: 'Цена', datafield: 'price', width: 150},
      {text: 'Коментарий', datafield: 'comments', width: 150},
      {text: 'Дата (редак.)', datafield: 'dateedit', width: 150},
      {text: 'Польз-ль (редак.)', datafield: 'useredit', width: 150}
    ];

  // define a data source for filtering table columns Node
  nodeListBoxSource: any[] =
    [
      {label: 'id_node', value: 'id_node', checked: true},

      {label: 'Номер узла в группе', value: 'num_node', checked: true},

      {label: 'Договор', value: 'code_contract', checked: true},
      {label: 'Географическое понятие', value: 'code_geograph', checked: true},
      {label: 'Тип узла', value: 'code_node_type', checked: true},
      {label: 'Владелец', value: 'code_owner', checked: true},

      {label: 'Широта', value: 'n_coordinate', checked: true},
      {label: 'Долгота', value: 'e_coordinate', checked: true},

      {label: 'Цена', value: 'price', checked: false},
      {label: 'Коментарий', value: 'comments', checked: false},
      {label: 'Дата (редак.)', value: 'dateedit', checked: false},
      {label: 'Польз-ль (редак.)', value: 'useredit', checked: false}
    ];

  constructor(
    // gateway service
    private geographService: GeographService,
    private owner_gatewayService: Owner_gatewayService,
    private gatewayTypeService: GatewayTypeService,
    private contract_gatewayService: Contract_gatewayService,
    // node service
    private owner_nodeService: Owner_nodeService,
    private nodeTypeService: NodeTypeService,
    private contract_nodeService: Contract_nodeService
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
    this.owner_gatewaySub.unsubscribe();
    this.gatewayTypeSub.unsubscribe();
    this.contract_gatewaySub.unsubscribe();

    // node subscription
    this.owner_nodeSub.unsubscribe();
    this.nodeTypeSub.unsubscribe();
    this.contract_nodeSub.unsubscribe();

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
    this.owner_gatewaySub = this.owner_gatewayService.fetch().subscribe(owners => this.owner_gateways = owners);
    this.gatewayTypeSub = this.gatewayTypeService.fetch().subscribe(gatewayTypes => this.gatewayTypes = gatewayTypes);
    this.contract_gatewaySub = this.contract_gatewayService.fetch().subscribe(contracts => this.contract_gateways = contracts);

    // node refbook
    this.owner_nodeSub = this.owner_nodeService.fetch().subscribe(owners => this.owner_nodes = owners);
    this.nodeTypeSub = this.nodeTypeService.fetch().subscribe(nodeTypes => this.nodeTypes = nodeTypes);
    this.contract_nodeSub = this.contract_nodeService.fetch().subscribe(contracts => this.contract_nodes = contracts);
  }

}
