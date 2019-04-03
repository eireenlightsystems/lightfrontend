import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {MaterialService} from '../../../../../shared/classes/material.service';
import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import {jqxGridComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';

import {Gateway} from '../../../../../shared/models/gateway';
import {GatewayService} from '../../../../../shared/services/gateway/gateway.service';


const STEP = 1000000000000;


@Component({
  selector: 'app-gatewaylink-form',
  templateUrl: './gatewaylink-form.component.html',
  styleUrls: ['./gatewaylink-form.component.css']
})
export class GatewaylinkFormComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() columns: any[];
  @Input() selectNodeId: number;

  // determine the functions that need to be performed in the parent component
  @Output() onSaveLinkwinBtn = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('linkWindow') linkWindow: jqxWindowComponent;
  @ViewChild('myGrid') myGrid: jqxGridComponent;

  // other variables
  rowcount = 0;
  gateways: Gateway[] = [];
  oSub: Subscription;
  offset = 0;
  limit = STEP;

  // define the data source for the table
  source_jqxgrid: any =
    {
      datatype: 'array',
      localdata: this.gateways,
      id: 'gatewayId',

      sortcolumn: ['gatewayId'],
      sortdirection: 'desc'
    };
  dataAdapter_jqxgrid: any = new jqx.dataAdapter(this.source_jqxgrid);


  constructor(private gatewayService: GatewayService) {
  }

  ngOnInit() {
    // this.getAll();

    this.myGrid.selectedrowindexes([]);
  }

  ngOnDestroy(): void {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  // refresh table
  refreshGrid() {
    this.source_jqxgrid.localdata = this.gateways;
    this.rowcount = this.gateways.length;
    this.myGrid.selectedrowindexes([]);
    this.myGrid.updatebounddata('data');

    this.linkWindow.open();
  }

  getAll() {
    this.oSub = this.gatewayService.getGatewayNotInGroup().subscribe(gateways => {
      this.gateways = gateways;
      this.refreshGrid();
    });
  }

  saveBtn() {
    const gatewayIds = [];
    for (let i = 0; i < this.myGrid.widgetObject.selectedrowindexes.length; i++) {
      gatewayIds[i] = this.source_jqxgrid.localdata[this.myGrid.widgetObject.selectedrowindexes[i]].gatewayId;
    }
    this.oSub = this.gatewayService.setNodeId(this.selectNodeId, gatewayIds).subscribe(
      response => {
        MaterialService.toast('Шлюзы привязаны к узлу!');
      },
      error => {
        MaterialService.toast(error.error.message);
      },
      () => {
        this.onSaveLinkwinBtn.emit();
        this.hideWindow();
      }
    );
  }

  cancelBtn() {
    this.hideWindow();
  }

  openWindow() {
    this.getAll();
    // this.linkWindow.open();
  }

  destroyWindow() {
    this.linkWindow.destroy();
  }

  hideWindow() {
    this.linkWindow.hide();
  }

  positionWindow(coord: any) {
    this.linkWindow.position({x: coord.x, y: coord.y});
  }

}
