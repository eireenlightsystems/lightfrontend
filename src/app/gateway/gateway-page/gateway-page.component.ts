import {Component, OnInit, OnDestroy, ViewChild, Input} from '@angular/core';

import {Contract, Geograph, EquipmentType, Owner} from '../../shared/interfaces';
import {GatewayMasterdetailsPageComponent} from './gateway-masterdetails-page/gateway-masterdetails-page.component';
import {GatewaymapPageComponent} from './gatewaymap-page/gatewaymap-page.component';


@Component({
  selector: 'app-gateway-page',
  templateUrl: './gateway-page.component.html',
  styleUrls: ['./gateway-page.component.css']
})
export class GatewayPageComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() geographs: Geograph[];
  // node source
  @Input() ownerNodes: Owner[];
  @Input() nodeTypes: EquipmentType[];
  @Input() contractNodes: Contract[];
  // gateway source
  @Input() ownerGateways: Owner[];
  @Input() gatewayTypes: EquipmentType[];
  @Input() contractGateways: Contract[];

  // define variables - link to view objects
  @ViewChild('gatewayMasterdetailsPageComponent') gatewayMasterdetailsPageComponent: GatewayMasterdetailsPageComponent;
  @ViewChild('gatewaymapPageComponent') gatewaymapPageComponent: GatewaymapPageComponent;

  isSourceChangeTab0: boolean;
  isSourceChangeTab1: boolean;

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

  constructor() {
  }

  ngOnInit() {
    this.isSourceChangeTab0 = false;
    this.isSourceChangeTab1 = false;
  }

  ngOnDestroy() {
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

}
