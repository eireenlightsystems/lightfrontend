import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {MaterialService} from "../../../../../shared/classes/material.service";
import {jqxWindowComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow";
import {jqxGridComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid";

import {Node} from "../../../../../shared/models/node";
import {GatewayNode} from "../../../../../shared/models/gatewayNode";
import {FilterNode} from "../../../../../shared/interfaces";
import {NodeService} from "../../../../../shared/services/node/node.service";


const STEP = 1000000000000


@Component({
  selector: 'app-nodelink-form',
  templateUrl: './nodelink-form.component.html',
  styleUrls: ['./nodelink-form.component.css']
})
export class NodelinkFormComponent implements OnInit, OnDestroy {

//variables from master component
  @Input() columns: any[]
  @Input() id_gateway_select: number

  //determine the functions that need to be performed in the parent component
  @Output() onSaveLinkwinBtn = new EventEmitter()

  //define variables - link to view objects
  @ViewChild('linkWindow') linkWindow: jqxWindowComponent
  @ViewChild('myGrid') myGrid: jqxGridComponent

  //other variables
  saveGatewayNode: GatewayNode = new GatewayNode()
  rowcount: number = 0
  nodes: Node[] = []
  filter: FilterNode = {
    id_geograph: -1,
    id_owner: -1,
    id_node_type: -1,
    id_contract: -1,
    id_gateway: -1
  }
  oSub: Subscription
  offset = 0
  limit = STEP

  constructor(private nodeService: NodeService) { }

  ngOnInit() {
    this.getAll()
  }

  ngOnDestroy(): void {
    this.oSub.unsubscribe()
  }

  //refresh table
  refreshGrid() {
    if (this.nodes && this.nodes.length > 0 && this.rowcount !== this.nodes.length) {
      this.source_jqxgrid.localdata = this.nodes;
      this.rowcount = this.nodes.length;
      this.myGrid.updatebounddata('cells');// passing `cells` to the `updatebounddata` method will refresh only the cells values when the new rows count is equal to the previous rows count.
    }
  }

  getAll() {
    const params = Object.assign({}, {
        offset: this.offset,
        limit: this.limit
      },
      this.filter)

    this.oSub = this.nodeService.getAll(params).subscribe(nodes => {
      this.nodes = this.nodes.concat(nodes)
      this.refreshGrid();
    })
  }

  //define the data source for the table
  source_jqxgrid: any =
    {
      datatype: 'array',
      localdata: this.nodes,
      id: 'id_node',

      sortcolumn: ['id_node'],
      sortdirection: 'desc'
    };
  dataAdapter_jqxgrid: any = new jqx.dataAdapter(this.source_jqxgrid);

  saveBtn() {
    for(var i=0; i < this.myGrid.widgetObject.selectedrowindexes.length; i++){
      this.saveGatewayNode.nodeId = this.source_jqxgrid.localdata[this.myGrid.widgetObject.selectedrowindexes[i]].id_node
      this.saveGatewayNode.gatewayId = this.id_gateway_select
      this.oSub = this.nodeService.ins_gateway_node(this.saveGatewayNode).subscribe(
        response => {
          // MaterialService.toast(`Шлюз id = ${response.id_gateway} привязан к узлу id = ${this.id_node_select}.`)
        },
        error => MaterialService.toast(error.error.message),
        () => {
          //refresh table
          this.onSaveLinkwinBtn.emit()
        }
      )
    }
    this.hideWindow()
  }

  cancelBtn() {
    this.hideWindow()
  }

  openWindow() {
    this.linkWindow.open()
  }

  destroyWindow() {
    this.linkWindow.destroy()
  }

  hideWindow() {
    this.linkWindow.hide();
  }

  positionWindow(coord: any) {
    this.linkWindow.position({x: coord.x, y: coord.y})
  }

}
