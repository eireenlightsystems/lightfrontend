import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  FilterNode,
  Geograph, NodeType,
  OwnerNode
} from '../../../../../shared/interfaces';


@Component({
  selector: 'app-nodelist-filter',
  templateUrl: './nodelist-filter.component.html',
  styleUrls: ['./nodelist-filter.component.css']
})

export class NodelistFilterComponent {

  // variables from master component
  @Input() geographs: Geograph[];
  @Input() ownerNodes: OwnerNode[];
  @Input() nodeTypes: NodeType[];

  // determine the functions that need to be performed in the parent component
  @Output() onFilter = new EventEmitter<FilterNode>();

  // other variables
  isValid = true;
  geographId: number;
  ownerId: number;
  nodeTypeId: number;
  nullVar = '';

  constructor() {
  }

  validate() {
    if (!(this.geographId && this.ownerId && this.nodeTypeId)) {
      this.isValid = false;
      return;
    }
  }

  submitFilter() {
    const filter: FilterNode = {
      geographId: '',
      ownerId: '',
      nodeTypeId: '',
      contractId: '',
      gatewayId: ''
    };

    if (this.geographId) {
      filter.geographId = this.geographId.toString();
    }
    if (this.ownerId) {
      filter.ownerId = this.ownerId.toString();
    }
    if (this.nodeTypeId) {
      filter.nodeTypeId = this.nodeTypeId.toString();
    }

    this.onFilter.emit(filter);
  }

}
