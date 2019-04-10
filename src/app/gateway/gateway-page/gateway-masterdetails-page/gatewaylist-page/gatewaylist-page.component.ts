import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/index';

import {Geograph, Contract, OwnerGateway, GatewayType, Gateway, FilterGateway, SourceForFilter} from '../../../../shared/interfaces';
import {GatewayService} from '../../../../shared/services/gateway/gateway.service';
import {GatewaylistJqxgridComponent} from './gatewaylist-jqxgrid/gatewaylist-jqxgrid.component';


const STEP = 1000000000000;


@Component({
  selector: 'app-gatewaylist-page',
  templateUrl: './gatewaylist-page.component.html',
  styleUrls: ['./gatewaylist-page.component.css']
})
export class GatewaylistPageComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() geographs: Geograph[];
  @Input() ownerGateways: OwnerGateway[];
  @Input() gatewayTypes: GatewayType[];
  @Input() contractGateways: Contract[];

  @Input() selectNodeId: number;

  @Input() heightGrid: number;
  @Input() isMasterGrid: boolean;
  @Input() selectionmode: string;

  @Input() isAdd: boolean;
  @Input() isUpdate: boolean;
  @Input() isDelete: boolean;
  @Input() isRefresh: boolean;
  @Input() isFilter_none: boolean;
  @Input() isFilter_list: boolean;
  @Input() isPlace: boolean;
  @Input() isPin_drop: boolean;

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshChildGrid = new EventEmitter<number>();
  @Output() onRefreshMap = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('gatewaylistJqxgridComponent') gatewaylistJqxgridComponent: GatewaylistJqxgridComponent;

  // other variables
  gateways: Gateway[] = [];
  filter: FilterGateway = {
    geographId: '',
    ownerId: '',
    gatewayTypeId: '',
    contractId: '',
    nodeId: ''
  };
  sourceForFilter: SourceForFilter[];
  oSub: Subscription;
  isFilterVisible = false;
  //
  offset = 0;
  limit = STEP;
  //
  loading = false;
  reloading = false;
  noMoreNodes = false;
  //
  selectGatewayId = 0;
  //
  isAddBtnDisabled: boolean;
  isEditBtnDisabled: boolean;
  isDeleteBtnDisabled: boolean;
  isRefreshBtnDisabled: boolean;
  isFilter_noneBtnDisabled: boolean;
  isFilter_listBtnDisabled: boolean;
  isPlaceBtnDisabled: boolean;
  isPin_dropBtnDisabled: boolean;

  constructor(private gatewayService: GatewayService) {
  }

  ngOnInit() {
    // if this.node is child grid, then we need update this.filter.nodeId
    if (!this.isMasterGrid) {
      this.filter.nodeId = this.selectNodeId.toString();
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
        name: 'ownerGateways',
        type: 'jqxComboBox',
        source: this.ownerGateways,
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
        name: 'gatewayTypes',
        type: 'jqxComboBox',
        source: this.gatewayTypes,
        theme: 'material',
        width: '300',
        height: '43',
        placeHolder: 'Тип шлюза:',
        displayMember: 'code',
        valueMember: 'id',
        defaultValue: '',
        selectId: ''
      }
    ];

    this.getAll();
    this.reloading = true;
  }

  ngOnDestroy() {
    if(this.oSub){
      this.oSub.unsubscribe();
    }
  }

  refreshGrid() {
    this.gateways = [];
    this.getAll();
    this.reloading = true;
    this.selectGatewayId = 0;

    // if this.nodes id master grid, then we need refresh child grid
    if (this.isMasterGrid) {
      this.refreshChildGrid(this.selectGatewayId);
    }

    // refresh map
    this.onRefreshMap.emit();
  }

  refreshChildGrid(gatewayId: number) {
    this.selectGatewayId = gatewayId;
    // refresh child grid
    this.onRefreshChildGrid.emit(gatewayId);
  }

  getAll() {
    // Disabled/available buttons
    if (!this.isMasterGrid && +this.filter.nodeId <= 0) {
      this.isAddBtnDisabled = true;
      this.isEditBtnDisabled = true;
      this.isDeleteBtnDisabled = true;
      this.isRefreshBtnDisabled = true;
      this.isFilter_noneBtnDisabled = true;
      this.isFilter_listBtnDisabled = true;
      this.isPlaceBtnDisabled = true;
      this.isPin_dropBtnDisabled = true;
    } else {
      this.isAddBtnDisabled = false;
      this.isEditBtnDisabled = false;
      this.isDeleteBtnDisabled = false;
      this.isRefreshBtnDisabled = false;
      this.isFilter_noneBtnDisabled = false;
      this.isFilter_listBtnDisabled = false;
      this.isPlaceBtnDisabled = false;
      this.isPin_dropBtnDisabled = false;
    }

    const params = Object.assign({}, {
        offset: this.offset,
        limit: this.limit
      },
      this.filter);

    this.oSub = this.gatewayService.getAll(params).subscribe(gateways => {
      this.gateways = this.gateways.concat(gateways);
      this.noMoreNodes = gateways.length < STEP;
      this.loading = false;
      this.reloading = false;
    });
  }

  loadMore() {
    this.offset += STEP;
    this.loading = true;
    this.getAll();
  }

  applyFilter(filter: FilterGateway) {
    this.gateways = [];
    this.offset = 0;
    this.filter = filter;
    this.reloading = true;
    this.getAll();
  }

  applyFilterFromFilter(event: any) {
    this.gateways = [];
    this.offset = 0;
    this.reloading = true;
    for (let i = 0; i < event.length; i++) {
      switch (event[i].name) {
        case 'geographs':
          this.filter.geographId = event[i].id;
          break;
        case 'ownerGateways':
          this.filter.ownerId = event[i].id;
          break;
        case 'gatewayTypes':
          this.filter.gatewayTypeId = event[i].id;
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
        case 'ownerGateways':
          this.sourceForFilter[i].source = this.ownerGateways;
          break;
        case 'gatewayTypes':
          this.sourceForFilter[i].source = this.gatewayTypes;
          break;
        default:
          break;
      }
    }
  }

  ins() {
    this.gatewaylistJqxgridComponent.ins();
  }

  upd() {
    this.gatewaylistJqxgridComponent.upd();
  }

  del() {
    this.gatewaylistJqxgridComponent.del();
  }

  place() {
    this.gatewaylistJqxgridComponent.place();
  }

  pin_drop() {
    this.gatewaylistJqxgridComponent.pin_drop();
  }
}
