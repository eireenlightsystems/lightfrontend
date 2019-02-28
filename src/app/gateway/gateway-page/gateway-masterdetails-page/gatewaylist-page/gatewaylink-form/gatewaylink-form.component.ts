import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {MaterialService} from "../../../../../shared/classes/material.service";
import {jqxWindowComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow";
import {jqxGridComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid";

import {Gateway} from "../../../../../shared/models/gateway";
import {FilterGateway} from "../../../../../shared/interfaces";
import {GatewayService} from "../../../../../shared/services/gateway/gateway.service";


const STEP = 1000000000000


@Component({
  selector: 'app-gatewaylink-form',
  templateUrl: './gatewaylink-form.component.html',
  styleUrls: ['./gatewaylink-form.component.css']
})
export class GatewaylinkFormComponent implements OnInit, OnDestroy {

  //variables from master component
  @Input() columns: any[]
  @Input() id_node_select: number

  //determine the functions that need to be performed in the parent component
  @Output() onSaveLinkwinBtn = new EventEmitter()

  //define variables - link to view objects
  @ViewChild('linkWindow') linkWindow: jqxWindowComponent
  @ViewChild('myGrid') myGrid: jqxGridComponent

  //other variables
  saveGateway: Gateway = new Gateway()
  rowcount: number = 0
  gateways: Gateway[] = []
  // id_fixture: number = 0
  filter: FilterGateway = {
    id_geograph: -1,
    id_owner: -1,
    id_gateway_type: -1,
    id_contract: -1,
    id_node: 1
  }
  oSub: Subscription
  offset = 0
  limit = STEP

  constructor(private gatewayService: GatewayService) { }

  ngOnInit() {
    this.getAll()
  }

  ngOnDestroy(): void {
    this.oSub.unsubscribe()
  }

  //refresh table
  refreshGrid() {
    if (this.gateways && this.gateways.length > 0 && this.rowcount !== this.gateways.length) {
      this.source_jqxgrid.localdata = this.gateways;
      this.rowcount = this.gateways.length;
      this.myGrid.updatebounddata('cells');// passing `cells` to the `updatebounddata` method will refresh only the cells values when the new rows count is equal to the previous rows count.
    }
  }

  getAll() {
    const params = Object.assign({}, {
        offset: this.offset,
        limit: this.limit
      },
      this.filter)

    this.oSub = this.gatewayService.getAll(params).subscribe(gateways => {
      this.gateways = this.gateways.concat(gateways)
      this.refreshGrid();
    })
  }

  //define the data source for the table
  source_jqxgrid: any =
    {
      datatype: 'array',
      localdata: this.gateways,
      id: 'id_gateway',

      sortcolumn: ['id_gateway'],
      sortdirection: 'desc'
    };
  dataAdapter_jqxgrid: any = new jqx.dataAdapter(this.source_jqxgrid);

  saveBtn() {
    for(var i=0; i < this.myGrid.widgetObject.selectedrowindexes.length; i++){
      this.saveGateway = this.source_jqxgrid.localdata[this.myGrid.widgetObject.selectedrowindexes[i]]
      this.saveGateway.id_node = this.id_node_select
      this.oSub = this.gatewayService.set_id_node(this.saveGateway).subscribe(
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
