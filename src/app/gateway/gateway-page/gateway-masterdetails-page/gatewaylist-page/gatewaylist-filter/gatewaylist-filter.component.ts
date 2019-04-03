import {Component, EventEmitter, Input, Output} from '@angular/core';

import {FilterGateway, Geograph, GatewayType, OwnerGateway} from '../../../../../shared/interfaces';

@Component({
  selector: 'app-gatewaylist-filter',
  templateUrl: './gatewaylist-filter.component.html',
  styleUrls: ['./gatewaylist-filter.component.css']
})
export class GatewaylistFilterComponent {

  // variables from master component
  @Input() geographs: Geograph[];
  @Input() ownerGateways: OwnerGateway[];
  @Input() gatewayTypes: GatewayType[];

  // determine the functions that need to be performed in the parent component
  @Output() onFilter = new EventEmitter<FilterGateway>();

  // other variables
  isValid = true;
  geographId: number;
  ownerId: number;
  gatewayTypeId: number;
  nullVar = '';

  constructor() {
  }

  validate() {
    if (!(this.geographId && this.ownerId && this.gatewayTypeId)) {
      this.isValid = false;
      return;
    }
  }

  submitFilter() {
    const filter: FilterGateway = {
      geographId: '',
      ownerId: '',
      gatewayTypeId: '',
      contractId: '',
      nodeId: ''
    };

    if (this.geographId) {
      filter.geographId = this.geographId.toString();
    }
    if (this.ownerId) {
      filter.ownerId = this.ownerId.toString();
    }
    if (this.gatewayTypeId) {
      filter.gatewayTypeId = this.gatewayTypeId.toString();
    }

    this.onFilter.emit(filter);
  }

}
