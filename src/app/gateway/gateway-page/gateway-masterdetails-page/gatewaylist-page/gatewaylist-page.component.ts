import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core'
import {Subscription} from 'rxjs/index'

import {Geograph, Contract, Owner_gateway, GatewayType, Gateway, FilterGateway} from '../../../../shared/interfaces'
import {GatewayService} from '../../../../shared/services/gateway/gateway.service'
import {GatewaylistJqxgridComponent} from "./gatewaylist-jqxgrid/gatewaylist-jqxgrid.component";


const STEP = 1000000000000


@Component({
  selector: 'app-gatewaylist-page',
  templateUrl: './gatewaylist-page.component.html',
  styleUrls: ['./gatewaylist-page.component.css']
})
export class GatewaylistPageComponent implements OnInit, OnDestroy {

  //variables from master component
  @Input() geographs: Geograph[]
  @Input() owner_gateways: Owner_gateway[]
  @Input() gatewayTypes: GatewayType[]
  @Input() contract_gateways: Contract[]

  @Input() heightGrid: number
  @Input() isMasterGrid: boolean
  @Input() id_node_select: number
  @Input() selectionmode: string

  @Input() isAdd: boolean
  @Input() isUpdate: boolean
  @Input() isDelete: boolean
  @Input() isRefresh: boolean
  @Input() isFilter_none: boolean
  @Input() isFilter_list: boolean
  @Input() isPlace: boolean
  @Input() isPin_drop: boolean

  //determine the functions that need to be performed in the parent component
  @Output() onRefreshChildGrid = new EventEmitter<number>()
  @Output() onRefreshMap = new EventEmitter()

  //define variables - link to view objects
  @ViewChild("gatewaylistJqxgridComponent") gatewaylistJqxgridComponent: GatewaylistJqxgridComponent;

  //other variables
  gateways: Gateway[] = []
  filter: FilterGateway = {
    id_geograph: -1,
    id_owner: -1,
    id_gateway_type: -1,
    id_contract: -1,
    id_node: -1
  }
  oSub: Subscription
  isFilterVisible = false
  //
  offset = 0
  limit = STEP
  //
  loading = false
  reloading = false
  noMoreNodes = false
  //
  id_gateway_select: number = 0;
  //
  isAddBtnDisabled: boolean
  isEditBtnDisabled: boolean
  isDeleteBtnDisabled: boolean
  isRefreshBtnDisabled: boolean
  isFilter_noneBtnDisabled: boolean
  isFilter_listBtnDisabled: boolean
  isPlaceBtnDisabled: boolean
  isPin_dropBtnDisabled: boolean

  constructor(private gatewayService: GatewayService) {
  }

  ngOnInit() {
    //if this.node is child grid, then we need update this.filter.id_node
    if (!this.isMasterGrid) this.filter.id_node = this.id_node_select

    this.getAll()
    this.reloading = true
  }

  ngOnDestroy() {
    this.oSub.unsubscribe()
  }

  refreshGrid() {
    this.gateways = []
    this.getAll()
    this.reloading = true
    this.id_gateway_select = 0

    //if this.nodes id master grid, then we need refresh child grid
    if (this.isMasterGrid) this.refreshChildGrid(this.id_gateway_select)

    //refresh map
    this.onRefreshMap.emit()
  }

  refreshChildGrid(id_gateway: number) {
    this.id_gateway_select = id_gateway
    //refresh child grid
    this.onRefreshChildGrid.emit(id_gateway)
  }

  getAll() {

    //Disabled/available buttons
    if (!this.isMasterGrid && this.filter.id_node <= 0) {
      this.isAddBtnDisabled = true
      this.isEditBtnDisabled = true
      this.isDeleteBtnDisabled = true
      this.isRefreshBtnDisabled = true
      this.isFilter_noneBtnDisabled = true
      this.isFilter_listBtnDisabled = true
      this.isPlaceBtnDisabled = true
      this.isPin_dropBtnDisabled = true
    } else {
      this.isAddBtnDisabled = false
      this.isEditBtnDisabled = false
      this.isDeleteBtnDisabled = false
      this.isRefreshBtnDisabled = false
      this.isFilter_noneBtnDisabled = false
      this.isFilter_listBtnDisabled = false
      this.isPlaceBtnDisabled = false
      this.isPin_dropBtnDisabled = false
    }

    const params = Object.assign({}, {
        offset: this.offset,
        limit: this.limit
      },
      this.filter)

    this.oSub = this.gatewayService.getAll(params).subscribe(gateways => {
      this.gateways = this.gateways.concat(gateways)
      this.noMoreNodes = gateways.length < STEP
      this.loading = false
      this.reloading = false
    })
  }

  loadMore() {
    this.offset += STEP
    this.loading = true
    this.getAll()
  }

  applyFilter(filter: FilterGateway) {
    this.gateways = []
    this.offset = 0
    this.filter = filter
    this.reloading = true
    this.getAll()
  }

  ins() {
    this.gatewaylistJqxgridComponent.ins()
  }

  upd() {
    this.gatewaylistJqxgridComponent.upd()
  }

  del() {
    this.gatewaylistJqxgridComponent.del()
  }

  place() {
    this.gatewaylistJqxgridComponent.place()
  }

  pin_drop() {
    this.gatewaylistJqxgridComponent.pin_drop()
  }
}
