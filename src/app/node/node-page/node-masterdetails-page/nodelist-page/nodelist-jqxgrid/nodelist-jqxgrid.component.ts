import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {MaterialService} from '../../../../../shared/classes/material.service'
import {jqxGridComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid";
import {jqxListBoxComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxlistbox";
import {jqxButtonComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons";

import {Node} from '../../../../../shared/models/node'
import {
  Geograph,
  Contract,
  Owner_node,
  NodeType
} from '../../../../../shared/interfaces'
import {NodeService} from "../../../../../shared/services/node/node.service";
import {EventWindowComponent} from "../../../../../shared/components/event-window/event-window.component";
import {NodeeditFormComponent} from "../nodeedit-form/nodeedit-form.component";


@Component({
  selector: 'app-nodelist-jqxgrid',
  templateUrl: './nodelist-jqxgrid.component.html',
  styleUrls: ['./nodelist-jqxgrid.component.css']
})

export class NodelistJqxgridComponent implements OnInit, OnDestroy, AfterViewInit {

  //variables from master component
  @Input() nodes: Node[]
  @Input() geographs: Geograph[]
  @Input() owner_nodes: Owner_node[]
  @Input() nodeTypes: NodeType[]
  @Input() contract_nodes: Contract[]

  @Input() heightGrid: number
  @Input() selectionmode: string
  @Input() isMasterGrid: boolean
  @Input() id_gateway_select: number

  //determine the functions that need to be performed in the parent component
  @Output() onRefreshGrid = new EventEmitter()
  @Output() onRefreshChildGrid = new EventEmitter<number>()

  //define variables - link to view objects
  @ViewChild('myListBox') myListBox: jqxListBoxComponent
  @ViewChild('myGrid') myGrid: jqxGridComponent
  @ViewChild('editWindow') editWindow: NodeeditFormComponent
  @ViewChild('eventWindow') eventWindow: EventWindowComponent
  @ViewChild('warningEventWindow') warningEventWindow: string
  @ViewChild('okButton') okButton: jqxButtonComponent

  //other variables
  selectNode: Node = new Node()
  oSub: Subscription
  editrow: number
  rowcount: number = 0
  islistBoxVisible: boolean = false
  actionEventWindow: string = ""

  constructor(private nodeService: NodeService) {
  }

  ngOnInit() {
    this.refreshGrid();
  }

  ngAfterViewInit(): void {
    this.refreshListBox()
  }

  ngOnDestroy() {
    if (this.oSub) {
      this.oSub.unsubscribe()
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

  //TABLE

  //refresh table
  refreshGrid() {
    if (this.nodes && this.nodes.length > 0 && this.rowcount !== this.nodes.length) {
      this.source_jqxgrid.localdata = this.nodes;
      this.rowcount = this.nodes.length;
      // this.myGrid.refresh();
      // this.myGrid.refreshdata();
      this.myGrid.updatebounddata('data');
      // this.myGrid.updatebounddata('cells');// passing `cells` to the `updatebounddata` method will refresh only the cells values when the new rows count is equal to the previous rows count.
    }
  }

  //define width of table
  getWidth(): any {
    if (document.body.offsetWidth > 1600) {
      if (this.islistBoxVisible) return '85%';
      else return '99.8%';
    } else if (document.body.offsetWidth > 1400) {
      if (this.islistBoxVisible) return '85%';
      else return '99.8%';
    } else if (document.body.offsetWidth > 1200) {
      if (this.islistBoxVisible) return '80%';
      else return '99.8%';
    } else if (document.body.offsetWidth > 1000) {
      if (this.islistBoxVisible) return '75%';
      else return '99.8%';
    } else if (document.body.offsetWidth > 800) {
      if (this.islistBoxVisible) return '70%';
      else return '99.8%';
    } else if (document.body.offsetWidth > 600) {
      if (this.islistBoxVisible) return '65%';
      else return '99.8%';
    } else {
      if (this.islistBoxVisible) return '40%';
      else return '99.8%';
    }
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

  //define columns for table
  columns: any[] =
    [
      {text: 'id_node', datafield: 'id_node', width: 150},
      {text: 'Договор', datafield: 'code_contract', width: 150},
      {text: 'Географическое понятие', datafield: 'code_geograph', width: 150},
      {text: 'Тип узла', datafield: 'code_node_type', width: 150},
      {text: 'Владелец', datafield: 'code_owner', width: 150},

      {text: 'Широта', datafield: 'n_coordinate', width: 150},
      {text: 'Долгота', datafield: 'e_coordinate', width: 150},

      {text: 'Цена', datafield: 'price', width: 150},
      {text: 'Коментарий', datafield: 'comments', width: 150},
      {text: 'Дата (редак.)', datafield: 'dateedit', width: 150},
      {text: 'Польз-ль (редак.)', datafield: 'useredit', width: 150}
    ];

  //define a data source for filtering table columns
  listBoxSource: any[] =
    [
      {label: 'id_node', value: 'id_node', checked: true},
      {label: 'Договор', value: 'code_contract', checked: true},
      {label: 'Географическое понятие', value: 'code_geograph', checked: true},
      {label: 'Тип узла', value: 'code_node_type', checked: true},
      {label: 'Владелец', value: 'code_owner', checked: true},

      {label: 'Широта', value: 'n_coordinate', checked: true},
      {label: 'Долгота', value: 'e_coordinate', checked: true},

      {label: 'Цена', value: 'price', checked: true},
      {label: 'Коментарий', value: 'comments', checked: true},
      {label: 'Дата (редак.)', value: 'dateedit', checked: false},
      {label: 'Польз-ль (редак.)', value: 'useredit', checked: false}
    ];

  //table filtering
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

  //functions-events when allocating a string
  onRowclick(event: any) {
  };

  onRowSelect(event: any) {
    // console.log("onRowSelect")
    if (event.args.row
    ) {
      this.selectNode = event.args.row;
      this.editrow = this.selectNode.id_node;

      //refresh child grid
      if (this.isMasterGrid) this.onRefreshChildGrid.emit(this.selectNode.id_node)
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


//INSERT, UPDATE, DELETE

  //insert node
  ins() {
    this.editWindow.positionWindow({x: 600, y: 90})
    this.editWindow.openWindow(null, "ins")
  }

  //update node
  upd() {
    this.editWindow.positionWindow({x: 600, y: 90})
    this.editWindow.openWindow(this.selectNode, "upd")
  }

  saveEditwinBtn() {
    //refresh table
    this.onRefreshGrid.emit()
  }

  //delete node
  del() {
    if (this.selectNode.id_node) {
      this.eventWindow.okButtonDisabled(false)
      this.warningEventWindow = `Удалить узел/столб id = "${this.selectNode.id_node}"?`
    } else {
      this.eventWindow.okButtonDisabled(true)
      this.warningEventWindow = `Вам следует выбрать узел/столб для удаления`
    }
    this.eventWindow.openEventWindow()
  }

  okEvenwinBtn() {
    let selectedrowindex = this.myGrid.getselectedrowindex();
    let id = this.myGrid.getrowid(selectedrowindex);

    if (+id >= 0) {
      this.nodeService.del(+id).subscribe(
        response => {
          MaterialService.toast(response.message)
        },
        error => MaterialService.toast(error.message),
        () => {
          //update the table without contacting the database
          // this.nodes.splice(selectedrowindex, 1)
          // this.refreshGrid();
          this.onRefreshGrid.emit()
        }
      )
    }
  }

  place() {
    // if (this.id_gateway_select > 1) {
    //   this.linkWindow.openWindow()
    // } else {
    //   this.eventWindow.okButtonDisabled(true)
    //   this.warningEventWindow = `Вам следует выбрать узел для привязки шлюзов`
    //   this.eventWindow.openEventWindow()
    // }

    if (this.selectNode.id_node) {
      this.eventWindow.okButtonDisabled(true)
      this.actionEventWindow = "pin_drop"
      this.warningEventWindow = `Функция в разработке`
    } else {
      this.eventWindow.okButtonDisabled(true)
      this.warningEventWindow = `Вам следует выбрать узел для отвязки от группы узлов шлюза`
    }
    this.eventWindow.openEventWindow()
  }

  pin_drop() {
    if (this.selectNode.id_node) {
      this.eventWindow.okButtonDisabled(true)
      this.actionEventWindow = "pin_drop"
      this.warningEventWindow = `Функция в разработке`
    } else {
      this.eventWindow.okButtonDisabled(true)
      this.warningEventWindow = `Вам следует выбрать узел для отвязки от группы узлов шлюза`
    }
    this.eventWindow.openEventWindow()
  }

}
