import {Component, EventEmitter, Input, Output, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {MaterialService} from '../../../../../shared/classes/material.service';
import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import {jqxDropDownListComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdropdownlist';

import {Gateway} from '../../../../../shared/models/gateway';
import {Contract, GatewayType, Geograph} from '../../../../../shared/interfaces';
import {GatewayService} from '../../../../../shared/services/gateway/gateway.service';
import {isUndefined} from 'util';

@Component({
  selector: 'app-gatewayedit-form',
  templateUrl: './gatewayedit-form.component.html',
  styleUrls: ['./gatewayedit-form.component.css']
})
export class GatewayeditFormComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() geographs: Geograph[];
  @Input() gatewayTypes: GatewayType[];
  @Input() contractGateways: Contract[];

  // determine the functions that need to be performed in the parent component
  @Output() onSaveEditwinBtn = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('editWindow') editWindow: jqxWindowComponent;
  @ViewChild('contractId') contractId: jqxDropDownListComponent;
  @ViewChild('gatewayTypeId') gatewayTypeId: jqxDropDownListComponent;

  // define variables for drop-down lists in the edit form
  source_gatewayType: any;
  dataAdapter_gatewayType: any;
  source_contract: any;
  dataAdapter_contract: any;

  contractId_index = 0;
  gatewayTypeId_index = 0;

  // other variables
  saveGateway: Gateway = new Gateway();
  oSub: Subscription;
  typeEditWindow = '';

  constructor(private gatewayService: GatewayService) {
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  // updating data sources for drop-down lists in the form
  refresh_refbook() {
    this.source_contract =
      {
        datatype: 'array',
        localdata: this.contractGateways,
        id: 'id',
      };
    this.dataAdapter_contract = new jqx.dataAdapter(this.source_contract);

    this.source_gatewayType =
      {
        datatype: 'array',
        localdata: this.gatewayTypes,
        id: 'id',
      };
    this.dataAdapter_gatewayType = new jqx.dataAdapter(this.source_gatewayType);
  }

  // define default values for the form
  define_defaultvalues(saveGateway: Gateway) {
    if (this.typeEditWindow === 'upd') {
      this.saveGateway = saveGateway;
      // determine the desired positions in the drop-down lists
      for (let i = 0; i < this.contractGateways.length; i++) {
        if (this.contractGateways[i].id === this.saveGateway.contractId) {
          this.contractId_index = i;
          break;
        }
      }
      for (let i = 0; i < this.gatewayTypes.length; i++) {
        if (this.gatewayTypes[i].id === this.saveGateway.gatewayTypeId) {
          this.gatewayTypeId_index = i;
          break;
        }
      }
    }
    if (this.typeEditWindow === 'ins') {
      this.contractId_index = 0;
      this.gatewayTypeId_index = 0;
      this.saveGateway.nodeId = !isUndefined(saveGateway.nodeId) && saveGateway.nodeId > 0 ? saveGateway.nodeId : 1;
      this.saveGateway.nodeGroupName = 'пусто';
      this.saveGateway.serialNumber = 'пусто';
      this.saveGateway.comment = 'пусто';
    }
  }

  // perform insert/update fixture
  saveBtn() {
    this.saveGateway.contractId = this.contractId.val();
    this.saveGateway.gatewayTypeId = this.gatewayTypeId.val();

    if (this.typeEditWindow === 'ins') {
      this.oSub = this.gatewayService.ins(this.saveGateway).subscribe(
        response => {
          this.saveGateway.gatewayId = +response;
          MaterialService.toast(`Шлюз c id = ${this.saveGateway.gatewayId} был добавлен.`);
        },
        error => MaterialService.toast(error.error.message),
        () => {
          // close edit window
          this.hideWindow();
          // update data source
          this.onSaveEditwinBtn.emit();
        }
      );
    }
    if (this.typeEditWindow === 'upd') {
      this.oSub = this.gatewayService.upd(this.saveGateway).subscribe(
        response => {
          MaterialService.toast(`Шлюз c id = ${this.saveGateway.gatewayId} был обновлен.`);
        },
        error => MaterialService.toast(error.error.message),
        () => {
          // close edit window
          this.hideWindow();
          // update data source
          this.onSaveEditwinBtn.emit();
        }
      );
    }
  }

  cancelBtn() {
    this.hideWindow();
  }

  openWindow(saveGateway: Gateway, typeEditWindow: string) {
    this.typeEditWindow = typeEditWindow;
    this.refresh_refbook();
    this.define_defaultvalues(saveGateway);
    this.editWindow.open();
  }

  destroyWindow() {
    this.editWindow.destroy();
  }

  hideWindow() {
    this.editWindow.hide();
  }

  positionWindow(coord: any) {
    this.editWindow.position({x: coord.x, y: coord.y});
  }

}
