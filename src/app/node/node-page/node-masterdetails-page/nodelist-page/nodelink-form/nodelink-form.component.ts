import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {MaterialService} from '../../../../../shared/classes/material.service';

import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import {jqxGridComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';

import {NodeService} from '../../../../../shared/services/node/node.service';
import {Node} from '../../../../../shared/interfaces';


@Component({
  selector: 'app-nodelink-form',
  templateUrl: './nodelink-form.component.html',
  styleUrls: ['./nodelink-form.component.css']
})
export class NodelinkFormComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() columns: any[];
  @Input() selectGatewayId: number;

  // determine the functions that need to be performed in the parent component
  @Output() onSaveLinkwinBtn = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('linkWindow') linkWindow: jqxWindowComponent;
  @ViewChild('myGrid') myGrid: jqxGridComponent;

  // other variables
  nodes: Node[] = [];
  oSub: Subscription;

  // define the data source for the table
  source_jqxgrid: any =
    {
      datatype: 'array',
      localdata: this.nodes,
      id: 'nodeId',

      sortcolumn: ['nodeId'],
      sortdirection: 'desc'
    };
  dataAdapter_jqxgrid: any = new jqx.dataAdapter(this.source_jqxgrid);


  constructor(private nodeService: NodeService) {
  }

  ngOnInit() {
    this.myGrid.selectedrowindexes([]);
  }

  ngOnDestroy(): void {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  // refresh table
  refreshGrid() {
    this.source_jqxgrid.localdata = this.nodes;
    this.myGrid.selectedrowindexes([]);
    this.myGrid.updatebounddata('data');

    this.linkWindow.open();
  }

  getAll() {
    this.oSub = this.nodeService.getNodeInGroup(1).subscribe(nodes => {
      this.nodes = nodes;
      this.refreshGrid();
    });
  }

  saveBtn() {
    const nodeIds = [];
    for (let i = 0; i < this.myGrid.widgetObject.selectedrowindexes.length; i++) {
      nodeIds[i] = this.source_jqxgrid.localdata[this.myGrid.widgetObject.selectedrowindexes[i]].nodeId;
    }
    this.oSub = this.nodeService.setNodeInGatewayGr(this.selectGatewayId, nodeIds).subscribe(
      response => {
        MaterialService.toast('Узлы добавлены в группу!');
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
