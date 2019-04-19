import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/index';

import {NodeService} from '../../../../shared/services/node/node.service';
import {
  Node,
  Geograph,
  Contract, FilterNode, EquipmentType, Owner, SourceForFilter, SettingButtonPanel
} from '../../../../shared/interfaces';
import {NodelistJqxgridComponent} from './nodelist-jqxgrid/nodelist-jqxgrid.component';
import {isUndefined} from 'util';


const STEP = 1000000000000;


@Component({
  selector: 'app-nodelist-page',
  templateUrl: './nodelist-page.component.html',
  styleUrls: ['./nodelist-page.component.css']
})

export class NodelistPageComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() geographs: Geograph[];
  @Input() ownerNodes: Owner[];
  @Input() nodeTypes: EquipmentType[];
  @Input() contractNodes: Contract[];

  @Input() heightGrid: number;
  @Input() selectGatewayId: number;
  @Input() selectionmode: string;
  @Input() isMasterGrid: boolean;

  @Input() settingButtonPanel: SettingButtonPanel;

  @Input() nodeSortcolumn: any[];
  @Input() nodeColumns: any[];
  @Input() nodeListBoxSource: any[];

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshChildGrid = new EventEmitter<number>();
  @Output() onRefreshMap = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('nodelistJqxgridComponent') nodelistJqxgridComponent: NodelistJqxgridComponent;

  // other variables
  nodes: Node[] = [];
  filter: FilterNode = {
    geographId: '',
    ownerId: '',
    nodeTypeId: '',
    contractId: '',
    gatewayId: ''
  };
  oSub: Subscription;
  isFilterVisible = false;
  sourceForFilter: SourceForFilter[];
  //
  offset = 0;
  limit = STEP;
  //
  loading = false;
  reloading = false;
  noMoreNodes = false;
  //
  selectNodeId = 0;


  constructor(private nodeService: NodeService) {
  }

  ngOnInit() {
    // if this.node is child grid, then we need update this.filter.gatewayId
    if (!this.isMasterGrid && !isUndefined(this.selectGatewayId)) {
      this.filter.gatewayId = this.selectGatewayId.toString();
    }

    // Definde filter
    this.sourceForFilter = [
      {
        name: 'geographs',
        type: 'jqxComboBox',
        source: this.geographs,
        theme: 'material',
        width: '300',
        height: '43',
        placeHolder: 'Геогр. понятие:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      },
      {
        name: 'ownerNodes',
        type: 'jqxComboBox',
        source: this.ownerNodes,
        theme: 'material',
        width: '300',
        height: '43',
        placeHolder: 'Владелец:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      },
      {
        name: 'nodeTypes',
        type: 'jqxComboBox',
        source: this.nodeTypes,
        theme: 'material',
        width: '300',
        height: '43',
        placeHolder: 'Тип узла/столба:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      }
    ];

    this.reloading = true;
    this.getAll();
  }

  ngOnDestroy() {
    this.oSub.unsubscribe();
  }

  refreshGrid() {
    this.nodes = [];
    this.getAll();
    this.reloading = true;
    this.selectNodeId = 0;

    // if this.nodes id master grid, then we need refresh child grid
    if (this.isMasterGrid) {
      this.refreshChildGrid(this.selectNodeId);
    }

    // refresh map
    this.onRefreshMap.emit();
  }

  refreshChildGrid(nodeId: number) {
    this.selectNodeId = nodeId;
    // refresh child grid
    this.onRefreshChildGrid.emit(nodeId);
  }

  getAll() {

    // Disabled/available buttons
    if (!this.isMasterGrid && +this.filter.gatewayId <= 0) {
      this.settingButtonPanel.add.disabled = true;
      this.settingButtonPanel.upd.disabled = true;
      this.settingButtonPanel.del.disabled = true;
      this.settingButtonPanel.refresh.disabled = true;
      this.settingButtonPanel.filterNone.disabled = true;
      this.settingButtonPanel.filterList.disabled = true;
      this.settingButtonPanel.place.disabled = true;
      this.settingButtonPanel.pinDrop.disabled = true;
      this.settingButtonPanel.groupIn.disabled = true;
      this.settingButtonPanel.groupOut.disabled = true;
      this.settingButtonPanel.switchOn.disabled = true;
      this.settingButtonPanel.switchOff.disabled = true;
    } else {
      this.settingButtonPanel.add.disabled = false;
      this.settingButtonPanel.upd.disabled = false;
      this.settingButtonPanel.del.disabled = false;
      this.settingButtonPanel.refresh.disabled = false;
      this.settingButtonPanel.filterNone.disabled = false;
      this.settingButtonPanel.filterList.disabled = false;
      this.settingButtonPanel.place.disabled = false;
      this.settingButtonPanel.pinDrop.disabled = false;
      this.settingButtonPanel.groupIn.disabled = false;
      this.settingButtonPanel.groupOut.disabled = false;
      this.settingButtonPanel.switchOn.disabled = false;
      this.settingButtonPanel.switchOff.disabled = false;
    }

    const params = Object.assign({}, {
        offset: this.offset,
        limit: this.limit
      },
      this.filter);

    this.oSub = this.nodeService.getAll(params).subscribe(nodes => {
      this.nodes = this.nodes.concat(nodes);
      this.noMoreNodes = nodes.length < STEP;
      this.loading = false;
      this.reloading = false;
    });
  }

  loadMore() {
    this.offset += STEP;
    this.loading = true;
    this.getAll();
  }

  applyFilter(event: any) {
    this.nodes = [];
    this.offset = 0;
    this.reloading = true;
    this.filter = event;
    this.getAll();
  }

  applyFilterFromFilter(event: any) {
    this.nodes = [];
    this.offset = 0;
    this.reloading = true;
    for (let i = 0; i < event.length; i++) {
      switch (event[i].nameField) {
        case 'geographs':
          this.filter.geographId = event[i].id;
          break;
        case 'ownerNodes':
          this.filter.ownerId = event[i].id;
          break;
        case 'nodeTypes':
          this.filter.nodeTypeId = event[i].id;
          break;
        default:
          break;
      }
    }
    this.getAll();
  }

  initSourceFilter() {
    for (let i = 0; i < this.sourceForFilter.length; i++) {
      switch (this.sourceForFilter[i].name) {
        case 'geographs':
          this.sourceForFilter[i].source = this.geographs;
          break;
        case 'ownerNodes':
          this.sourceForFilter[i].source = this.ownerNodes;
          break;
        case 'nodeTypes':
          this.sourceForFilter[i].source = this.nodeTypes;
          break;
        default:
          break;
      }
    }
  }

  ins() {
    this.nodelistJqxgridComponent.ins();
  }

  upd() {
    this.nodelistJqxgridComponent.upd();
  }

  del() {
    this.nodelistJqxgridComponent.del();
  }

  refresh() {
    this.refreshGrid();
  }

  filterNone() {
    this.nodelistJqxgridComponent.islistBoxVisible = !this.nodelistJqxgridComponent.islistBoxVisible;
  }

  filterList() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  place() {
    this.nodelistJqxgridComponent.place();
  }

  pinDrop() {
    this.nodelistJqxgridComponent.pinDrop();
  }

  groupIn() {
    this.nodelistJqxgridComponent.groupIn();
  }

  groupOut() {
    this.nodelistJqxgridComponent.groupOut();
  }

  switchOn() {

  }

  switchOff() {

  }
}
