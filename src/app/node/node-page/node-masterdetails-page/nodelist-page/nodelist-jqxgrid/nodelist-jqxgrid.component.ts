import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';

import {MaterialService} from '../../../../../shared/classes/material.service';
import {jqxGridComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import {jqxListBoxComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxlistbox';

import {Node, Geograph, Contract, Owner, EquipmentType, SourceForLinkForm, ItemsLinkForm} from '../../../../../shared/interfaces';
import {NodeService} from '../../../../../shared/services/node/node.service';
import {EventWindowComponent} from '../../../../../shared/components/event-window/event-window.component';
import {NodeeditFormComponent} from '../nodeedit-form/nodeedit-form.component';
import {LinkFormComponent} from '../../../../../shared/components/link-form/link-form.component';



@Component({
  selector: 'app-nodelist-jqxgrid',
  templateUrl: './nodelist-jqxgrid.component.html',
  styleUrls: ['./nodelist-jqxgrid.component.css']
})

export class NodelistJqxgridComponent implements OnInit, OnDestroy, AfterViewInit {

  // variables from master component
  @Input() nodes: Node[];
  @Input() geographs: Geograph[];
  @Input() ownerNodes: Owner[];
  @Input() nodeTypes: EquipmentType[];
  @Input() contractNodes: Contract[];
  @Input() nodeSortcolumn: any[];
  @Input() nodeColumns: any[];
  @Input() nodeListBoxSource: any[];

  @Input() heightGrid: number;
  @Input() selectionmode: string;
  @Input() isMasterGrid: boolean;
  @Input() selectGatewayId: number;

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshGrid = new EventEmitter();
  @Output() onRefreshChildGrid = new EventEmitter<number>();

  // define variables - link to view objects
  @ViewChild('myListBox') myListBox: jqxListBoxComponent;
  @ViewChild('myGrid') myGrid: jqxGridComponent;
  @ViewChild('editWindow') editWindow: NodeeditFormComponent;
  @ViewChild('eventWindow') eventWindow: EventWindowComponent;
  @ViewChild('linkWindow') linkWindow: LinkFormComponent;

  // other variables
  selectNode: Node = new Node();
  oSub: Subscription;
  oSubForLinkWin: Subscription;
  oSubLink: Subscription;
  rowcount = 0;
  islistBoxVisible = false;
  actionEventWindow = '';
  warningEventWindow = '';
  sourceForLinkForm: SourceForLinkForm;

  source_jqxgrid: any =
    {
      datatype: 'array',
      localdata: this.nodes,
      id: 'nodeId',
      sortcolumn: this.nodeSortcolumn,
      sortdirection: 'asc'
    };
  dataAdapter_jqxgrid: any = new jqx.dataAdapter(this.source_jqxgrid);
  columns: any[];
  listBoxSource: any[];

  constructor(private nodeService: NodeService) {
  }

  ngOnInit() {
    this.refresh_jqxgGrid();

    // Definde filter
    this.sourceForLinkForm = {
      window: {
        code: 'linkGatewayNodes',
        name: 'Выбрать узлы',
        theme: 'material',
        autoOpen: false,
        isModal: true,
        modalOpacity: 0.3,
        width: 1200,
        maxWidth: 1200,
        minWidth: 500,
        height: 500,
        maxHeight: 800,
        minHeight: 600

      },
      grid: {
        source: [],
        columns: this.nodeColumns,
        theme: 'material',
        width: 1186,
        height: 485,
        columnsresize: true,
        sortable: true,
        filterable: true,
        altrows: true,
        selectionmode: 'checkbox',

        valueMember: 'nodeId',
        sortcolumn: ['nodeId'],
        sortdirection: 'desc',
        selectId: []
      }
    };
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
    if (this.oSubForLinkWin) {
      this.oSubForLinkWin.unsubscribe();
    }
    if (this.oSubLink) {
      this.oSubLink.unsubscribe();
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
    this.myGrid.deleterow(this.selectNode.nodeId);
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

  onRowSelect(event: any) {
    if (event.args.row) {
      this.selectNode = event.args.row;

      // refresh child grid
      if (this.isMasterGrid) {
        this.onRefreshChildGrid.emit(this.selectNode.nodeId);
      }
    }
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

  saveLinkwinBtn(event: ItemsLinkForm) {
    if (event.code === this.sourceForLinkForm.window.code) {
      this.oSubLink = this.nodeService.setNodeInGatewayGr(this.selectGatewayId, event.Ids).subscribe(
        response => {
          MaterialService.toast('Узлы добавлены в группу!');
        },
        error => {
          MaterialService.toast(error.error.message);
        },
        () => {
          this.linkWindow.hideWindow();
          // refresh table
          this.onRefreshGrid.emit();
        }
      );
    }
  }

  getSourceForLinkForm() {
    this.oSubForLinkWin = this.nodeService.getNodeInGroup(1).subscribe(
      response => {
        this.sourceForLinkForm.grid.source = response;
        this.linkWindow.refreshGrid();
      },
      error => {
        MaterialService.toast(error.error.message);
      }
    );
  }

  // delete node
  del() {
    if (this.selectNode.nodeId) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'del';
      this.warningEventWindow = `Удалить узел/столб id = "${this.selectNode.nodeId}"?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать узел/столб для удаления`;
    }
    this.eventWindow.openEventWindow();
  }

  okEvenwinBtn() {
    const nodeIds = [];
    for (let i = 0; i < this.myGrid.widgetObject.selectedrowindexes.length; i++) {
      nodeIds[i] = this.source_jqxgrid.localdata[this.myGrid.widgetObject.selectedrowindexes[i]].nodeId;
    }

    if (this.actionEventWindow === 'del') {
      const selectedrowindex = this.myGrid.getselectedrowindex();
      const id = this.myGrid.getrowid(selectedrowindex);

      if (+id >= 0) {
        this.nodeService.del(+id).subscribe(
          response => {
            MaterialService.toast('Узел был удален!');
          },
          error => MaterialService.toast(error.error.message),
          () => {
            this.refresh_del();
          }
        );
      }
    }

    if (this.actionEventWindow === 'group_out') {
      this.oSub = this.nodeService.delNodeInGatewayGr(this.selectGatewayId, nodeIds).subscribe(
        response => {
          MaterialService.toast('Узлы удалены из группы!');
        },
        error => {
          MaterialService.toast(error.error.message);
        },
        () => {
          // refresh table
          this.onRefreshGrid.emit();
        }
      );
    }
  }

  place() {

  }

  pin_drop() {

  }

  group_in() {
    if (this.selectGatewayId > 1) {
      this.linkWindow.openWindow();
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать шлюз для привязки узлов`;
      this.eventWindow.openEventWindow();
    }
  }

  group_out() {
    if (this.selectNode.nodeId) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'group_out';
      this.warningEventWindow = `Отвязать узлы от шлюза?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать узлы для отвязки от шлюза`;
    }
    this.eventWindow.openEventWindow();
  }

}
