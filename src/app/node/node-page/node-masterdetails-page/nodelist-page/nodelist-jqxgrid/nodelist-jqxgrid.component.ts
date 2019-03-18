import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {MaterialService} from '../../../../../shared/classes/material.service';
import {jqxGridComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import {jqxListBoxComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxlistbox';
import {jqxButtonComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';

import {Node} from '../../../../../shared/models/node';
import {
  Geograph,
  Contract,
  Owner_node,
  NodeType
} from '../../../../../shared/interfaces';
import {NodeService} from '../../../../../shared/services/node/node.service';
import {EventWindowComponent} from '../../../../../shared/components/event-window/event-window.component';
import {NodeeditFormComponent} from '../nodeedit-form/nodeedit-form.component';
import {NodelinkFormComponent} from '../nodelink-form/nodelink-form.component';
import {GatewayNode} from '../../../../../shared/models/gatewayNode';


@Component({
  selector: 'app-nodelist-jqxgrid',
  templateUrl: './nodelist-jqxgrid.component.html',
  styleUrls: ['./nodelist-jqxgrid.component.css']
})

export class NodelistJqxgridComponent implements OnInit, OnDestroy, AfterViewInit {

  // variables from master component
  @Input() nodes: Node[];
  @Input() geographs: Geograph[];
  @Input() owner_nodes: Owner_node[];
  @Input() nodeTypes: NodeType[];
  @Input() contract_nodes: Contract[];
  @Input() nodeSortcolumn: any[];
  @Input() nodeColumns: any[];
  @Input() nodeListBoxSource: any[];

  @Input() heightGrid: number;
  @Input() selectionmode: string;
  @Input() isMasterGrid: boolean;
  @Input() id_gateway_select: number;

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshGrid = new EventEmitter();
  @Output() onRefreshChildGrid = new EventEmitter<number>();

  // define variables - link to view objects
  @ViewChild('myListBox') myListBox: jqxListBoxComponent;
  @ViewChild('myGrid') myGrid: jqxGridComponent;
  @ViewChild('editWindow') editWindow: NodeeditFormComponent;
  @ViewChild('eventWindow') eventWindow: EventWindowComponent;
  @ViewChild('warningEventWindow') warningEventWindow: string;
  @ViewChild('okButton') okButton: jqxButtonComponent;
  @ViewChild('linkWindow') linkWindow: NodelinkFormComponent;

  // other variables
  selectNode: Node = new Node();
  saveGatewayNode: GatewayNode = new GatewayNode();
  oSub: Subscription;
  rowcount = 0;
  islistBoxVisible = false;
  actionEventWindow = '';

  source_jqxgrid: any;
  dataAdapter_jqxgrid: any;
  columns: any[];
  listBoxSource: any[];

  constructor(private nodeService: NodeService) {
  }

  ngOnInit() {
    this.source_jqxgrid =
      {
        datatype: 'array',
        localdata: this.nodes,
        id: 'id_node',
        sortcolumn: this.nodeSortcolumn,
        sortdirection: 'asc'
      };
    this.dataAdapter_jqxgrid = new jqx.dataAdapter(this.source_jqxgrid);
    this.refresh_jqxgGrid();
  }

  ngAfterViewInit(): void {
    this.refreshListBox();
  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
    if (this.myListBox) {
      this.myListBox.destroy();
    }
    if (this.myGrid) {
      this.myGrid.destroy();
    }
    if (this.editWindow) {
      this.editWindow.destroyWindow();
    }
    if (this.eventWindow) {
      this.eventWindow.destroyEventWindow();
    }
  }

  // TABLE

  // refresh table
  refresh_jqxgGrid() {
    if (this.nodes && this.nodes.length > 0 && this.rowcount !== this.nodes.length) {
      this.source_jqxgrid.localdata = this.nodes;
      this.rowcount = this.nodes.length;
      this.myGrid.updatebounddata('data');
    }
  }

  refresh_del() {
    this.myGrid.deleterow(this.selectNode.id_node);
  }

  // define width of table
  getWidth(): any {
    if (document.body.offsetWidth > 1600) {
      if (this.islistBoxVisible) {
        return '85%';
      } else {
        return '99.8%';
      }
    } else if (document.body.offsetWidth > 1400) {
      if (this.islistBoxVisible) {
        return '85%';
      } else {
        return '99.8%';
      }
    } else if (document.body.offsetWidth > 1200) {
      if (this.islistBoxVisible) {
        return '80%';
      } else {
        return '99.8%';
      }
    } else if (document.body.offsetWidth > 1000) {
      if (this.islistBoxVisible) {
        return '75%';
      } else {
        return '99.8%';
      }
    } else if (document.body.offsetWidth > 800) {
      if (this.islistBoxVisible) {
        return '70%';
      } else {
        return '99.8%';
      }
    } else if (document.body.offsetWidth > 600) {
      if (this.islistBoxVisible) {
        return '65%';
      } else {
        return '99.8%';
      }
    } else {
      if (this.islistBoxVisible) {
        return '40%';
      } else {
        return '99.8%';
      }
    }
  }

  // table filtering
  myListBoxOnCheckChange(event: any) {
    this.myGrid.beginupdate();
    if (event.args.checked) {
      this.myGrid.showcolumn(event.args.value);
    } else {
      this.myGrid.hidecolumn(event.args.value);
    }
    this.myGrid.endupdate();
  };

  refreshListBox() {
    this.myGrid.beginupdate();
    for (var i = 0; i < this.myListBox.attrSource.length; i++) {
      if (this.myListBox.attrSource[i].checked) {
        this.myGrid.showcolumn(this.myListBox.attrSource[i].value);
      } else {
        this.myGrid.hidecolumn(this.myListBox.attrSource[i].value);
      }
    }
    this.myGrid.endupdate();
  };

  // functions-events when allocating a string
  onRowclick(event: any) {
  };

  onRowSelect(event: any) {
    // console.log("onRowSelect")
    if (event.args.row) {
      this.selectNode = event.args.row;

      // refresh child grid
      if (this.isMasterGrid) {
        this.onRefreshChildGrid.emit(this.selectNode.id_node);
      }
    }
    // this.updateButtons('Select');
  };

  onRowUnselect(event: any) {
    // console.log("onRowUnselect")
    // this.updateButtons('Unselect');
  };

  onRowBeginEdit(event: any) {
    // console.log("onRowBeginEdit")
    // this.updateButtons('Edit');
  };

  onRowEndEdit(event: any) {
    // console.log("onRowEndEdit")
    // this.updateButtons('End Edit');
  };


// INSERT, UPDATE, DELETE

  // insert node
  ins() {
    this.editWindow.positionWindow({x: 600, y: 90});
    this.editWindow.openWindow(null, 'ins');
  }

  // update node
  upd() {
    this.editWindow.positionWindow({x: 600, y: 90});
    this.editWindow.openWindow(this.selectNode, 'upd');
  }

  saveEditwinBtn() {
    // refresh table
    this.onRefreshGrid.emit();
  }

  saveLinkwinBtn() {
    // refresh table
    this.onRefreshGrid.emit();
  }

  // delete node
  del() {
    if (this.selectNode.id_node) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'del';
      this.warningEventWindow = `Удалить узел/столб id = "${this.selectNode.id_node}"?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать узел/столб для удаления`;
    }
    this.eventWindow.openEventWindow();
  }

  okEvenwinBtn() {
    if (this.actionEventWindow === 'del') {
      const selectedrowindex = this.myGrid.getselectedrowindex();
      const id = this.myGrid.getrowid(selectedrowindex);

      if (+id >= 0) {
        this.nodeService.del(+id).subscribe(
          response => {
            MaterialService.toast(response.message);
          },
          error => MaterialService.toast(error.message),
          () => {
            // update the table without contacting the database
            // this.nodes.splice(selectedrowindex, 1)
            // this.refreshGrid();
            // this.onRefreshGrid.emit();
            this.refresh_del();
          }
        );
      }
    }

    if (this.actionEventWindow === 'pin_drop') {
      for (var i = 0; i < this.myGrid.widgetObject.selectedrowindexes.length; i++) {
        this.saveGatewayNode.gatewayId = this.id_gateway_select;
        this.saveGatewayNode.nodeId = this.source_jqxgrid.localdata[this.myGrid.widgetObject.selectedrowindexes[i]].id_node;

        this.oSub = this.nodeService.del_gateway_node(this.saveGatewayNode).subscribe(
          response => {
            // MaterialService.toast(`Светильник c id = ${response.id_fixture} был отвязан от столба.`)
          },
          error => MaterialService.toast(error.message),
          () => {
            // refresh table
            this.onRefreshGrid.emit();
          }
        );
      }
    }
  }

  place() {
    if (this.id_gateway_select > 1) {
      this.linkWindow.openWindow();
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать шлюз для привязки узлов`;
      this.eventWindow.openEventWindow();
    }
  }

  pin_drop() {
    if (this.selectNode.id_node) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'pin_drop';
      this.warningEventWindow = `Отвязать узлы от шлюза?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать узлы для отвязки от шлюза`;
    }
    this.eventWindow.openEventWindow();
  }

}
