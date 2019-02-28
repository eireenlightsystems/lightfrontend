import {Component, EventEmitter, Input, Output} from '@angular/core';

import {FilterGateway, Geograph, GatewayType, Owner_gateway} from "../../../../../shared/interfaces";

@Component({
  selector: 'app-gatewaylist-filter',
  templateUrl: './gatewaylist-filter.component.html',
  styleUrls: ['./gatewaylist-filter.component.css']
})
export class GatewaylistFilterComponent {

  //variables from master component
  @Input() geographs: Geograph[]
  @Input() owner_gateways: Owner_gateway[]
  @Input() gatewayTypes: GatewayType[]

  //determine the functions that need to be performed in the parent component
  @Output() onFilter = new EventEmitter<FilterGateway>()

  //other variables
  isValid = true
  id_geograph: number
  id_owner: number
  id_gateway_type: number

  constructor() {
  }

  validate() {
    if (!(this.id_geograph && this.id_owner && this.id_gateway_type)) {
      this.isValid = false
      return
    }
  }

  submitFilter() {
    const filter: FilterGateway = {
      id_geograph: -1,
      id_owner: -1,
      id_gateway_type: -1,
      id_contract: -1,
      id_node: -1
    }

    if (this.id_geograph) {
      filter.id_geograph = this.id_geograph
    }
    if (this.id_owner) {
      filter.id_owner = this.id_owner
    }
    if (this.id_gateway_type) {
      filter.id_gateway_type = this.id_gateway_type
    }

    this.onFilter.emit(filter)
  }

}
