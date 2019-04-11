import {Component, EventEmitter, Input, Output, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {jqxWindowComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow';
import {Subscription} from 'rxjs';
import {MaterialService} from '../../../../../shared/classes/material.service';
import {jqxDropDownListComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdropdownlist';

import {Node} from '../../../../../shared/models/node';
import {Contract, Geograph, EquipmentType} from '../../../../../shared/interfaces';
import {NodeService} from '../../../../../shared/services/node/node.service';

@Component({
  selector: 'app-nodeedit-form',
  templateUrl: './nodeedit-form.component.html',
  styleUrls: ['./nodeedit-form.component.css']
})

export class NodeeditFormComponent implements OnInit, OnDestroy {

  // variables from master component
  @Input() geographs: Geograph[];
  @Input() nodeTypes: EquipmentType[];
  @Input() contractNodes: Contract[];

  // determine the functions that need to be performed in the parent component
  @Output() onSaveEditwinBtn = new EventEmitter();

  // define variables - link to view objects
  @ViewChild('editWindow') editWindow: jqxWindowComponent;
  @ViewChild('contractId') contractId: jqxDropDownListComponent;
  @ViewChild('geographId') geographId: jqxDropDownListComponent;
  @ViewChild('nodeTypeId') nodeTypeId: jqxDropDownListComponent;

  // define variables for drop-down lists in the edit form
  source_geogr: any;
  dataAdapter_geogr: any;
  source_nodeType: any;
  dataAdapter_nodeType: any;
  source_contract: any;
  dataAdapter_contract: any;

  contractId_index = 0;
  geographId_index = 0;
  nodeTypeId_index = 0;

  // other variables
  saveNode: Node = new Node();
  oSub: Subscription;
  typeEditWindow = '';

  constructor(private nodeService: NodeService) {
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
        localdata: this.contractNodes,
        id: 'contractId',
      };
    this.dataAdapter_contract = new jqx.dataAdapter(this.source_contract);

    this.source_geogr =
      {
        datatype: 'array',
        localdata: this.geographs,
        id: 'id',
      };
    this.dataAdapter_geogr = new jqx.dataAdapter(this.source_geogr);

    this.source_nodeType =
      {
        datatype: 'array',
        localdata: this.nodeTypes,
        id: 'id',
      };
    this.dataAdapter_nodeType = new jqx.dataAdapter(this.source_nodeType);
  }

  // define default values for the form
  define_defaultvalues(saveNode: Node) {
    if (this.typeEditWindow === 'upd') {
      this.saveNode = saveNode;
      // determine the desired positions in the drop-down lists
      for (let i = 0; i < this.contractNodes.length; i++) {
        if (this.contractNodes[i].id === this.saveNode.contractId) {
          this.contractId_index = i;
          break;
        }
      }
      for (let i = 0; i < this.nodeTypes.length; i++) {
        if (this.nodeTypes[i].id === this.saveNode.nodeTypeId) {
          this.nodeTypeId_index = i;
          break;
        }
      }
      for (let i = 0; i < this.geographs.length; i++) {
        if (this.geographs[i].id === this.saveNode.geographId) {
          this.geographId_index = i;
          break;
        }
      }
    }
    if (this.typeEditWindow === 'ins') {
      this.contractId_index = 0;
      this.nodeTypeId_index = 0;
      this.geographId_index = 0;

      this.saveNode.nodeId = 0;
      this.saveNode.n_coordinate = 0;
      this.saveNode.e_coordinate = 0;
      this.saveNode.serialNumber = 'пусто';
      this.saveNode.comment = 'пусто';
    }
  }

  // perform insert/update fixture
  saveBtn() {
    this.saveNode.contractId = this.contractId.val();
    this.saveNode.nodeTypeId = this.nodeTypeId.val();
    this.saveNode.geographId = this.geographId.val();
    if (this.typeEditWindow === 'ins') {
      this.oSub = this.nodeService.ins(this.saveNode).subscribe(
        response => {
          this.saveNode.nodeId = +response;
          MaterialService.toast(`Узел/столб c id = ${this.saveNode.nodeId} был добавлен.`);
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
      this.oSub = this.nodeService.upd(this.saveNode).subscribe(
        response => {
          MaterialService.toast(`Узел/столб c id = ${this.saveNode.nodeId} был обновлен.`);
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
    // this.onCancelEditwinBtn.emit()
    this.hideWindow();
  }

  openWindow(saveNode: Node, typeEditWindow: string) {
    this.typeEditWindow = typeEditWindow;
    this.refresh_refbook();
    this.define_defaultvalues(saveNode);
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
