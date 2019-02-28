import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  FilterNode,
  Geograph, NodeType,
  Owner_node
} from "../../../../../shared/interfaces";


@Component({
  selector: 'app-nodelist-filter',
  templateUrl: './nodelist-filter.component.html',
  styleUrls: ['./nodelist-filter.component.css']
})

export class NodelistFilterComponent {

  //variables from master component
  @Input() geographs: Geograph[]
  @Input() owner_nodes: Owner_node[]
  @Input() nodeTypes: NodeType[]

  //determine the functions that need to be performed in the parent component
  @Output() onFilter = new EventEmitter<FilterNode>()

  //other variables
  isValid = true
  id_geograph: number
  id_owner: number
  id_node_type: number

  constructor() {
  }

  validate() {
    if (!(this.id_geograph && this.id_owner && this.id_node_type)) {
      this.isValid = false
      return
    }
  }

  submitFilter() {
    const filter: FilterNode = {
      id_geograph: -1,
      id_owner: -1,
      id_node_type: -1,
      id_contract: -1,
      id_gateway: -1
    }

    if (this.id_geograph) {
      filter.id_geograph = this.id_geograph
    }
    if (this.id_owner) {
      filter.id_owner = this.id_owner
    }
    if (this.id_node_type) {
      filter.id_node_type = this.id_node_type
    }

    this.onFilter.emit(filter)
  }

}
