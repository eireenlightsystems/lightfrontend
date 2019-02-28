import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {MaterialService} from '../../../../../shared/classes/material.service'
import {jqxGridComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid";
import {jqxListBoxComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxlistbox";
import {jqxButtonComponent} from "jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons";

import {Gateway} from '../../../../../shared/models/gateway'
import {Geograph, Contract, Owner_gateway, GatewayType} from '../../../../../shared/interfaces'

import {GatewayService} from "../../../../../shared/services/gateway/gateway.service";
import {EventWindowComponent} from "../../../../../shared/components/event-window/event-window.component";
import {GatewayeditFormComponent} from "../gatewayedit-form/gatewayedit-form.component";
import {FixturelinkFormComponent} from "../../../../../fixture/fixture-page/fixture-masterdetails-page/fixturelist-page/fixturelink-form/fixturelink-form.component";
import {Fixture} from "../../../../../shared/models/fixture";

@Component({
  selector: 'app-gatewaylist-jqxgrid',
  templateUrl: './gatewaylist-jqxgrid.component.html',
  styleUrls: ['./gatewaylist-jqxgrid.component.css']
})
export class GatewaylistJqxgridComponent implements OnInit, OnDestroy, AfterViewInit {

  //variables from master component
  @Input() gateways: Gateway[]
  @Input() geographs: Geograph[]
  @Input() owner_gateways: Owner_gateway[]
  @Input() gatewayTypes: GatewayType[]
  @Input() contract_gateways: Contract[]

  @Input() heightGrid: number
  @Input() isMasterGrid: number
  @Input() selectionmode: string
  @Input() id_node_select: number

  //determine the functions that need to be performed in the parent component
  @Output() onRefreshGrid = new EventEmitter()
  @Output() onRefreshChildGrid = new EventEmitter<number>()

  //define variables - link to view objects
  @ViewChild('myListBox') myListBox: jqxListBoxComponent
  @ViewChild('myGrid') myGrid: jqxGridComponent
  @ViewChild('editWindow') editWindow: GatewayeditFormComponent
  @ViewChild('eventWindow') eventWindow: EventWindowComponent
  @ViewChild('warningEventWindow') warningEventWindow: string
  @ViewChild('okButton') okButton: jqxButtonComponent
  @ViewChild('linkWindow') linkWindow: FixturelinkFormComponent

  //other variables
  selectGateway: Gateway = new Gateway()
  saveGateway: Gateway = new Gateway()
  oSub: Subscription
  editrow: number
  rowcount: number = 0
  islistBoxVisible: boolean = false
  actionEventWindow: string = ""

  constructor(private gatewayService: GatewayService) {
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
    if (this.gateways && this.gateways.length > 0 && this.rowcount !== this.gateways.length) {
      this.source_jqxgrid.localdata = this.gateways;
      this.rowcount = this.gateways.length;
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
      localdata: this.gateways,
      id: 'id_gateway',

      sortcolumn: ['id_gateway'],
      sortdirection: 'desc'
    };
  dataAdapter_jqxgrid: any = new jqx.dataAdapter(this.source_jqxgrid);

  //define columns for table
  columns: any[] =
    [
      {text: 'id_gateway', datafield: 'id_gateway', width: 150},
      {text: 'Договор', datafield: 'code_contract', width: 150},
      {text: 'Географическое понятие', datafield: 'code_geograph', width: 150},
      {text: 'Тип узла', datafield: 'code_gateway_type', width: 150},
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
      {label: 'id_gateway', value: 'id_gateway', checked: true},
      {label: 'Договор', value: 'code_contract', checked: true},
      {label: 'Географическое понятие', value: 'code_geograph', checked: true},
      {label: 'Тип узла', value: 'code_gateway_type', checked: true},
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
    // console.log("onRowclick")
  };

  onRowSelect(event: any) {
    // console.log("onRowSelect")
    if (event.args.row
    ) {
      this.selectGateway = event.args.row;
      this.editrow = this.selectGateway.id_gateway;

      //refresh child grid
      if (this.isMasterGrid) this.onRefreshChildGrid.emit(this.selectGateway.id_gateway)
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
    this.editWindow.openWindow(this.selectGateway, "upd")
  }

  saveEditwinBtn() {
    //refresh table
    this.onRefreshGrid.emit()
  }

  saveLinkwinBtn() {
    //refresh table
    this.onRefreshGrid.emit()
  }

  //delete node
  del() {
    if (this.selectGateway.id_gateway) {
      this.eventWindow.okButtonDisabled(false)
      this.actionEventWindow = "del"
      this.warningEventWindow = `Удалить шлюз id = "${this.selectGateway.id_gateway}"?`
    } else {
      this.eventWindow.okButtonDisabled(true)
      this.warningEventWindow = `Вам следует выбрать шлюз для удаления`
    }
    this.eventWindow.openEventWindow()
  }

  okEvenwinBtn() {
    if (this.actionEventWindow === "del") {
      let selectedrowindex = this.myGrid.getselectedrowindex();
      let id = this.myGrid.getrowid(selectedrowindex);

      if (+id >= 0) {
        this.gatewayService.del(+id).subscribe(
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

    if (this.actionEventWindow === "pin_drop") {
      for(var i=0; i < this.myGrid.widgetObject.selectedrowindexes.length; i++){
        this.saveGateway = this.source_jqxgrid.localdata[this.myGrid.widgetObject.selectedrowindexes[i]]
        this.saveGateway.id_node = 1
        this.oSub = this.gatewayService.set_id_node(this.saveGateway).subscribe(
          response => {
            // MaterialService.toast(`Светильник c id = ${response.id_fixture} был отвязан от столба.`)
          },
          error => MaterialService.toast(error.message),
          () => {
            //refresh table
            this.onRefreshGrid.emit()
          }
        )
      }
    }
  }

  place() {
    if (this.id_node_select > 1) {
      this.linkWindow.openWindow()
    } else {
      this.eventWindow.okButtonDisabled(true)
      this.warningEventWindow = `Вам следует выбрать узел для привязки шлюзов`
      this.eventWindow.openEventWindow()
    }
  }

  pin_drop() {
    if (this.selectGateway.id_gateway) {
      this.eventWindow.okButtonDisabled(false)
      this.actionEventWindow = "pin_drop"
      this.warningEventWindow = `Отвязать шлюз от узла?`
    } else {
      this.eventWindow.okButtonDisabled(true)
      this.warningEventWindow = `Вам следует выбрать шлюз для отвязки от узла`
    }
    this.eventWindow.openEventWindow()
  }
}
