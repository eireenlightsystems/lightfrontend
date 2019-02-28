import {Component, EventEmitter, Input, Output, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";
import {MaterialService} from "../../../../../shared/classes/material.service";
import {jqxWindowComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow";
import {jqxDropDownListComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxdropdownlist";

import {Gateway} from "../../../../../shared/models/gateway";
import {Contract, GatewayType, Geograph} from "../../../../../shared/interfaces";
import {GatewayService} from "../../../../../shared/services/gateway/gateway.service";

@Component({
  selector: 'app-gatewayedit-form',
  templateUrl: './gatewayedit-form.component.html',
  styleUrls: ['./gatewayedit-form.component.css']
})
export class GatewayeditFormComponent implements OnInit, OnDestroy {

//variables from master component
  @Input() geographs: Geograph[]
  @Input() gatewayTypes: GatewayType[]
  @Input() contract_gateways: Contract[]

  //determine the functions that need to be performed in the parent component
  @Output() onSaveEditwinBtn = new EventEmitter()

  //define variables - link to view objects
  @ViewChild('editWindow') editWindow: jqxWindowComponent
  @ViewChild('id_contract') id_contract: jqxDropDownListComponent
  @ViewChild('id_geograph') id_geograph: jqxDropDownListComponent
  @ViewChild('id_gateway_type') id_gatewayType: jqxDropDownListComponent

  //define variables for drop-down lists in the edit form
  // source_geogr: any
  // dataAdapter_geogr: any
  source_gatewayType: any
  dataAdapter_gatewayType: any
  source_contract: any
  dataAdapter_contract: any

  id_contract_index = 0
  // id_geograph_index = 0
  id_gateway_type_index = 0

  //other variables
  saveGateway: Gateway = new Gateway()
  oSub: Subscription
  typeEditWindow: string = ""

  constructor(private gatewayService: GatewayService) { }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe()
    }
  }

  //updating data sources for drop-down lists in the form
  refresh_refbook() {
    this.source_contract =
      {
        datatype: 'array',
        localdata: this.contract_gateways,
        id: 'id_contract',
      };
    this.dataAdapter_contract = new jqx.dataAdapter(this.source_contract);

    // this.source_geogr =
    //   {
    //     datatype: 'array',
    //     localdata: this.geographs,
    //     id: 'id_geograph',
    //   };
    // this.dataAdapter_geogr = new jqx.dataAdapter(this.source_geogr);

    this.source_gatewayType =
      {
        datatype: 'array',
        localdata: this.gatewayTypes,
        id: 'id_gateway_type',
      };
    this.dataAdapter_gatewayType = new jqx.dataAdapter(this.source_gatewayType);
  }

  //define default values for the form
  define_defaultvalues(saveGateway: Gateway) {
    if (this.typeEditWindow === "upd") {
      this.saveGateway = saveGateway
      //determine the desired positions in the drop-down lists
      for (let i = 0; i < this.contract_gateways.length; i++) {
        if (this.contract_gateways[i].id_contract === this.saveGateway.id_contract) {
          this.id_contract_index = i;
          break;
        }
      }
      for (let i = 0; i < this.gatewayTypes.length; i++) {
        if (this.gatewayTypes[i].id_gateway_type === this.saveGateway.id_gateway_type) {
          this.id_gateway_type_index = i;
          break;
        }
      }
      // for (let i = 0; i < this.geographs.length; i++) {
      //   if (this.geographs[i].id_geograph === this.saveGateway.id_geograph) {
      //     this.id_geograph_index = i;
      //     break;
      //   }
      // }
    }
    if (this.typeEditWindow === "ins") {
      this.id_contract_index = 0
      this.id_gateway_type_index = 0
      // this.id_geograph_index = 0

      this.saveGateway.id_node = 1
      this.saveGateway.price = 0
      this.saveGateway.comments = "пусто"
    }
  }

  //perform insert/update fixture
  saveBtn() {
    this.saveGateway.id_contract = this.id_contract.val();
    this.saveGateway.id_gateway_type = this.id_gatewayType.val();
    // this.saveGateway.id_geograph = this.id_geograph.val();

    if (this.typeEditWindow === "ins") {
      this.oSub = this.gatewayService.ins(this.saveGateway).subscribe(
        response => {
          this.saveGateway.id_gateway = response.id_gateway
          MaterialService.toast(`Шлюз c id = ${response.id_gateway} был добавлен.`)
        },
        error => MaterialService.toast(error.error.message),
        () => {
          //close edit window
          this.hideWindow();
          //update data source
          this.onSaveEditwinBtn.emit()
        }
      )
    }
    if (this.typeEditWindow === "upd") {
      this.oSub = this.gatewayService.upd(this.saveGateway).subscribe(
        response => {
          MaterialService.toast(`Шлюз c id = ${response.id_gateway} был обновлен.`)
        },
        error => MaterialService.toast(error.error.message),
        () => {
          //close edit window
          this.hideWindow();
          //update data source
          this.onSaveEditwinBtn.emit()
        }
      )
    }
  }

  cancelBtn() {
    // this.onCancelEditwinBtn.emit()
    this.hideWindow()
  }

  openWindow(saveGateway: Gateway, typeEditWindow: string) {
    this.typeEditWindow = typeEditWindow
    this.refresh_refbook()
    this.define_defaultvalues(saveGateway)
    this.editWindow.open()
  }

  destroyWindow() {
    this.editWindow.destroy()
  }

  hideWindow() {
    this.editWindow.hide();
  }

  positionWindow(coord: any) {
    this.editWindow.position({x: coord.x, y: coord.y})
  }

}
