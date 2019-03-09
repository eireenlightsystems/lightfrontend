import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core'
import {Subscription} from 'rxjs/index'

import {NodeService} from '../../../../shared/services/node/node.service'
import {
  Node,
  Geograph,
  Contract, FilterNode, NodeType, Owner_node
} from '../../../../shared/interfaces'
import {NodelistJqxgridComponent} from "./nodelist-jqxgrid/nodelist-jqxgrid.component";


const STEP = 1000000000000


@Component({
  selector: 'app-nodelist-page',
  templateUrl: './nodelist-page.component.html',
  styleUrls: ['./nodelist-page.component.css']
})

export class NodelistPageComponent implements OnInit, OnDestroy {

  //variables from master component
  @Input() geographs: Geograph[]
  @Input() owner_nodes: Owner_node[]
  @Input() nodeTypes: NodeType[]
  @Input() contract_nodes: Contract[]

  @Input() heightGrid: number
  @Input() id_gateway_select: number
  @Input() selectionmode: string
  @Input() isMasterGrid: boolean

  @Input() isAdd: boolean
  @Input() isUpdate: boolean
  @Input() isDelete: boolean
  @Input() isRefresh: boolean
  @Input() isFilter_none: boolean
  @Input() isFilter_list: boolean
  @Input() isPlace: boolean
  @Input() isPin_drop: boolean

  @Input() nodeSortcolumn: any[]
  @Input() nodeColumns: any[]
  @Input() nodeListBoxSource: any[]

  //determine the functions that need to be performed in the parent component
  @Output() onRefreshChildGrid = new EventEmitter<number>()
  @Output() onRefreshMap = new EventEmitter()

  //define variables - link to view objects
  @ViewChild("nodelistJqxgridComponent") nodelistJqxgridComponent: NodelistJqxgridComponent;

  //other variables
  nodes: Node[] = []
  filter: FilterNode = {
    id_geograph: -1,
    id_owner: -1,
    id_node_type: -1,
    id_contract: -1,
    id_gateway: -1
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
  id_node_select: number = 0;
  //
  isAddBtnDisabled: boolean
  isEditBtnDisabled: boolean
  isDeleteBtnDisabled: boolean
  isRefreshBtnDisabled: boolean
  isFilter_noneBtnDisabled: boolean
  isFilter_listBtnDisabled: boolean
  isPlaceBtnDisabled: boolean
  isPin_dropBtnDisabled: boolean

  constructor(private nodeService: NodeService) {
  }

  ngOnInit() {
    //if this.node is child grid, then we need update this.filter.id_gateway
    if(!this.isMasterGrid)this.filter.id_gateway = this.id_gateway_select

    this.getAll()
    this.reloading = true
  }

  ngOnDestroy() {
    this.oSub.unsubscribe()
  }

  refreshGrid() {
    this.nodes = []
    this.getAll()
    this.reloading = true
    this.id_node_select = 0

    //if this.nodes id master grid, then we need refresh child grid
    if(this.isMasterGrid)this.refreshChildGrid(this.id_node_select)

    //refresh map
    this.onRefreshMap.emit()
  }

  refreshChildGrid(id_node: number) {
    this.id_node_select = id_node
    //refresh child grid
    this.onRefreshChildGrid.emit(id_node)
  }

  getAll() {

    //Disabled/available buttons
    if (!this.isMasterGrid && this.filter.id_gateway <= 0) {
      this.isAddBtnDisabled = true
      this.isEditBtnDisabled = true
      this.isDeleteBtnDisabled = true
      this.isRefreshBtnDisabled = true
      this.isFilter_noneBtnDisabled = true
      this.isFilter_listBtnDisabled = true
      this.isPlaceBtnDisabled = true
      this.isPin_dropBtnDisabled = true
    }else {
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

    this.oSub = this.nodeService.getAll(params).subscribe(nodes => {
      this.nodes = this.nodes.concat(nodes)
      this.noMoreNodes = nodes.length < STEP
      this.loading = false
      this.reloading = false
    })
  }

  loadMore() {
    this.offset += STEP
    this.loading = true
    this.getAll()
  }

  applyFilter(filter: FilterNode) {
    this.nodes = []
    this.offset = 0
    this.filter = filter
    this.reloading = true
    this.getAll()
  }

  ins() {
    this.nodelistJqxgridComponent.ins()
  }

  upd() {
    this.nodelistJqxgridComponent.upd()
  }

  del() {
    this.nodelistJqxgridComponent.del()
  }

  place(){
    this.nodelistJqxgridComponent.place()
  }

  pin_drop(){
    this.nodelistJqxgridComponent.pin_drop()
  }
}
