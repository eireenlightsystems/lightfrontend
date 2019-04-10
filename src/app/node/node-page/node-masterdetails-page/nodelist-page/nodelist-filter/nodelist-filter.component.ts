import {
  Component,
  EventEmitter,
  Input, OnInit,
  Output
} from '@angular/core';

import {
  FilterNode,
  Geograph, NodeType,
  OwnerNode
} from '../../../../../shared/interfaces';
import {isUndefined} from 'util';


@Component({
  selector: 'app-nodelist-filter',
  templateUrl: './nodelist-filter.component.html',
  styleUrls: ['./nodelist-filter.component.css']
})

export class NodelistFilterComponent implements OnInit {

  // variables from master component
  @Input() geographs: Geograph[];
  @Input() ownerNodes: OwnerNode[];
  @Input() nodeTypes: NodeType[];

  // determine the functions that need to be performed in the parent component
  @Output() onFilter = new EventEmitter<FilterNode>();

  // other variables
  isValid = true;
  geographId: string;
  ownerId: string;
  nodeTypeId: string;

  sourceGeograph_jqx: any;
  dataAdapterGeograph_jqx: any;
  sourceOwner_jqx: any;
  dataAdapterOwner_jqx: any;
  sourceType_jqx: any;
  dataAdapterType_jqx: any;


  constructor() {
  }

  ngOnInit() {
    this.sourceGeograph_jqx =
      {
        datatype: 'array',
        localdata: this.geographs,
        id: 'id',
        sortcolumn: 'code',
        sortdirection: 'asc'
      };
    this.dataAdapterGeograph_jqx = new jqx.dataAdapter(this.sourceGeograph_jqx);

    this.sourceOwner_jqx =
      {
        datatype: 'array',
        localdata: this.ownerNodes,
        id: 'id',
        sortcolumn: 'code',
        sortdirection: 'asc'
      };
    this.dataAdapterOwner_jqx = new jqx.dataAdapter(this.sourceOwner_jqx);

    this.sourceType_jqx =
      {
        datatype: 'array',
        localdata: this.nodeTypes,
        id: 'id',
        sortcolumn: 'code',
        sortdirection: 'asc'
      };
    this.dataAdapterType_jqx = new jqx.dataAdapter(this.sourceType_jqx);
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
      filter.geographId = this.geographId;
    }
    if (this.ownerId) {
      filter.ownerId = this.ownerId;
    }
    if (this.nodeTypeId) {
      filter.nodeTypeId = this.nodeTypeId;
    }

    this.onFilter.emit(filter);
  }

  geographOnSelect(event: any) {
    if (!isUndefined(event.args)) {
      this.geographId = event.args.item.value;
    } else {
      this.geographId = '';
    }
  }

  ownerOnSelect(event: any) {
    if (!isUndefined(event.args)) {
      this.ownerId = event.args.item.value;
    } else {
      this.ownerId = '';
    }
  }

  typeOnSelect(event: any) {
    if (!isUndefined(event.args)) {
      this.nodeTypeId = event.args.item.value;
    } else {
      this.nodeTypeId = '';
    }
  }
}
