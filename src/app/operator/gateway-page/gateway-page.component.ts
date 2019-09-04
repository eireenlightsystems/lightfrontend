// angular lib
import {Component, OnInit, OnDestroy, ViewChild, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
// jqwidgets
// app interfaces
import {Contract, EquipmentType, Owner, NavItem} from '../../shared/interfaces';
// app services
// app components
import {GatewayMasterdetailsPageComponent} from './gateway-masterdetails-page/gateway-masterdetails-page.component';
import {GatewaymapPageComponent} from './gatewaymap-page/gatewaymap-page.component';


@Component({
  selector: 'app-gateway-page',
  templateUrl: './gateway-page.component.html',
  styleUrls: ['./gateway-page.component.css']
})
export class GatewayPageComponent implements OnInit, OnDestroy {

  // variables from parent component
  @Input() siteMap: NavItem[];
  @Input() tabsWidth: number;
  // node source
  @Input() ownerNodes: Owner[];
  @Input() nodeTypes: EquipmentType[];
  @Input() contractNodes: Contract[];
  // gateway source
  @Input() ownerGateways: Owner[];
  @Input() gatewayTypes: EquipmentType[];
  @Input() contractGateways: Contract[];

  // determine the functions that need to be performed in the parent component

  // define variables - link to view objects
  @ViewChild('gatewayMasterdetailsPageComponent', {static: false}) gatewayMasterdetailsPageComponent: GatewayMasterdetailsPageComponent;
  @ViewChild('gatewaymapPageComponent', {static: false}) gatewaymapPageComponent: GatewaymapPageComponent;

  constructor(
    // service
    public translate: TranslateService) {
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  refreshGrid() {

  }

  refreshMap() {

  }
}
