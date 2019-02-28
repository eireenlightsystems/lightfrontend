import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Contract, GatewayType, Geograph, Owner_gateway} from "../../../shared/interfaces";

@Component({
  selector: 'app-gatewaymap-page',
  templateUrl: './gatewaymap-page.component.html',
  styleUrls: ['./gatewaymap-page.component.css']
})
export class GatewaymapPageComponent implements OnInit {

  //variables from master component
  @Input() geographs: Geograph[]
  @Input() owner_gateways: Owner_gateway[]
  @Input() gatewayTypes: GatewayType[]
  @Input() contract_gateways: Contract[]

  //determine the functions that need to be performed in the parent component
  @Output() onRefreshGrid = new EventEmitter()

  //define variables - link to view objects

  constructor() { }

  ngOnInit() {
  }

  //refresh Map
  refreshMap() {
    // this.getAll();
  }
}
