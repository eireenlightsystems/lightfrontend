import {Component, EventEmitter, Input, Output, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {jqxWindowComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxwindow";
import {Subscription} from "rxjs";
import {MaterialService} from "../../../../../shared/classes/material.service";
import {jqxDropDownListComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxdropdownlist";

import {Node} from "../../../../../shared/models/node";
import {Contract, Geograph, NodeType} from "../../../../../shared/interfaces";
import {NodeService} from "../../../../../shared/services/node/node.service";

@Component({
  selector: 'app-nodeedit-form',
  templateUrl: './nodeedit-form.component.html',
  styleUrls: ['./nodeedit-form.component.css']
})

export class NodeeditFormComponent implements OnInit, OnDestroy {

  //variables from master component
  @Input() geographs: Geograph[]
  @Input() nodeTypes: NodeType[]
  @Input() contract_nodes: Contract[]

  //determine the functions that need to be performed in the parent component
  @Output() onSaveEditwinBtn = new EventEmitter()

  //define variables - link to view objects
  @ViewChild('editWindow') editWindow: jqxWindowComponent
  @ViewChild('id_contract') id_contract: jqxDropDownListComponent
  @ViewChild('id_geograph') id_geograph: jqxDropDownListComponent
  @ViewChild('id_node_type') id_nodeType: jqxDropDownListComponent

  //define variables for drop-down lists in the edit form
  source_geogr: any
  dataAdapter_geogr: any
  source_nodeType: any
  dataAdapter_nodeType: any
  source_contract: any
  dataAdapter_contract: any

  id_contract_index = 0
  id_geograph_index = 0
  id_node_type_index = 0

  //other variables
  saveNode: Node = new Node()
  oSub: Subscription
  typeEditWindow: string = ""

  constructor(private nodeService: NodeService) { }

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
        localdata: this.contract_nodes,
        id: 'id_contract',
      };
    this.dataAdapter_contract = new jqx.dataAdapter(this.source_contract);

    this.source_geogr =
      {
        datatype: 'array',
        localdata: this.geographs,
        id: 'id_geograph',
      };
    this.dataAdapter_geogr = new jqx.dataAdapter(this.source_geogr);

    this.source_nodeType =
      {
        datatype: 'array',
        localdata: this.nodeTypes,
        id: 'id_node_type',
      };
    this.dataAdapter_nodeType = new jqx.dataAdapter(this.source_nodeType);
  }

  //define default values for the form
  define_defaultvalues(saveNode: Node) {
    if (this.typeEditWindow === "upd") {
      this.saveNode = saveNode
      //determine the desired positions in the drop-down lists
      for (let i = 0; i < this.contract_nodes.length; i++) {
        if (this.contract_nodes[i].id_contract === this.saveNode.id_contract) {
          this.id_contract_index = i;
          break;
        }
      }
      for (let i = 0; i < this.nodeTypes.length; i++) {
        if (this.nodeTypes[i].id_node_type === this.saveNode.id_node_type) {
          this.id_node_type_index = i;
          break;
        }
      }
      for (let i = 0; i < this.geographs.length; i++) {
        if (this.geographs[i].id_geograph === this.saveNode.id_geograph) {
          this.id_geograph_index = i;
          break;
        }
      }
    }
    if (this.typeEditWindow === "ins") {
      this.id_contract_index = 0
      this.id_node_type_index = 0
      this.id_geograph_index = 0

      this.saveNode.id_node = 0
      this.saveNode.n_coordinate = 0
      this.saveNode.e_coordinate = 0
      this.saveNode.price = 0
      this.saveNode.comments = "пусто"
    }
  }

  //perform insert/update fixture
  saveBtn() {
    this.saveNode.id_contract = this.id_contract.val();
    this.saveNode.id_node_type = this.id_nodeType.val();
    this.saveNode.id_geograph = this.id_geograph.val();
    if (this.typeEditWindow === "ins") {
      this.oSub = this.nodeService.ins(this.saveNode).subscribe(
        response => {
          this.saveNode.id_node = response.id_node
          MaterialService.toast(`Узел/столб c id = ${response.id_node} был добавлен.`)
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
      this.oSub = this.nodeService.upd(this.saveNode).subscribe(
        response => {
          MaterialService.toast(`Узел/столб c id = ${response.id_node} был обновлен.`)
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

  openWindow(saveNode: Node, typeEditWindow: string) {
    this.typeEditWindow = typeEditWindow
    this.refresh_refbook()
    this.define_defaultvalues(saveNode)
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
