import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {MaterialService} from '../../../../../shared/classes/material.service';
import {jqxGridComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import {jqxListBoxComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxlistbox';
import {jqxButtonComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';

import {Gateway, Geograph, Contract, Owner, EquipmentType, SourceForLinkForm, ItemsLinkForm} from '../../../../../shared/interfaces';

import {GatewayService} from '../../../../../shared/services/gateway/gateway.service';
import {EventWindowComponent} from '../../../../../shared/components/event-window/event-window.component';
import {GatewayeditFormComponent} from '../gatewayedit-form/gatewayedit-form.component';
import {LinkFormComponent} from '../../../../../shared/components/link-form/link-form.component';


@Component({
  selector: 'app-gatewaylist-jqxgrid',
  templateUrl: './gatewaylist-jqxgrid.component.html',
  styleUrls: ['./gatewaylist-jqxgrid.component.css']
})
export class GatewaylistJqxgridComponent implements OnInit, OnDestroy, AfterViewInit {

  // variables from master component
  @Input() gateways: Gateway[];
  @Input() geographs: Geograph[];
  @Input() ownerGateways: Owner[];
  @Input() gatewayTypes: EquipmentType[];
  @Input() contractGateways: Contract[];

  @Input() heightGrid: number;
  @Input() isMasterGrid: number;
  @Input() selectionmode: string;
  @Input() selectNodeId: number;

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshGrid = new EventEmitter();
  @Output() onRefreshChildGrid = new EventEmitter<number>();

  // define variables - link to view objects
  @ViewChild('myListBox') myListBox: jqxListBoxComponent;
  @ViewChild('myGrid') myGrid: jqxGridComponent;
  @ViewChild('editWindow') editWindow: GatewayeditFormComponent;
  @ViewChild('eventWindow') eventWindow: EventWindowComponent;
  @ViewChild('warningEventWindow') warningEventWindow: string;
  @ViewChild('okButton') okButton: jqxButtonComponent;
  @ViewChild('linkWindow') linkWindow: LinkFormComponent;

  // other variables
  selectGateway: Gateway = new Gateway();
  oSub: Subscription;
  oSubForLinkWin: Subscription;
  oSubLink: Subscription;
  editrow: number;
  rowcount = 0;
  islistBoxVisible = false;
  actionEventWindow = '';
  sourceForLinkForm: SourceForLinkForm;

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

  // define columns for table
  columns: any[] =
    [
      {text: 'gatewayId', datafield: 'gatewayId', width: 150},
      {text: 'Наимен. гр. столбов', datafield: 'nodeGroupName', width: 150},
      {text: 'Договор', datafield: 'contractCode', width: 150},
      {text: 'Географическое понятие', datafield: 'geographCode', width: 150},
      {text: 'Тип узла', datafield: 'gatewayTypeCode', width: 150},
      {text: 'Владелец', datafield: 'ownerCode', width: 150},

      {text: 'Широта', datafield: 'n_coordinate', width: 150},
      {text: 'Долгота', datafield: 'e_coordinate', width: 150},

      {text: 'Серийный номер', datafield: 'serialNumber', width: 150},
      {text: 'Коментарий', datafield: 'comment', width: 150},
    ];

  // define a data source for filtering table columns
  listBoxSource: any[] =
    [
      {label: 'gatewayId', value: 'gatewayId', checked: true},
      {label: 'Наимен. гр. столбов', value: 'nodeGroupName', checked: true},
      {label: 'Договор', value: 'contractCode', checked: true},
      {label: 'Географическое понятие', value: 'geographCode', checked: true},
      {label: 'Тип узла', value: 'gatewayTypeCode', checked: true},
      {label: 'Владелец', value: 'ownerCode', checked: true},

      {label: 'Широта', value: 'n_coordinate', checked: true},
      {label: 'Долгота', value: 'e_coordinate', checked: true},

      {label: 'Серийный номер', value: 'serialNumber', checked: true},
      {label: 'Коментарий', value: 'comment', checked: true},
    ];


  constructor(private gatewayService: GatewayService) {
  }

  ngOnInit() {
    this.refresh_jqxgGrid();

    // Definde filter
    this.sourceForLinkForm = {
      window: {
        code: 'linkGateway',
        name: 'Выбрать шлюз',
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
        columns: this.columns,
        theme: 'material',
        width: 1186,
        height: 485,
        columnsresize: true,
        sortable: true,
        filterable: true,
        altrows: true,
        selectionmode: 'checkbox',

        valueMember: 'gatewayId',
        sortcolumn: ['gatewayId'],
        sortdirection: 'desc',
        selectId: []
      }
    };
  }

  ngAfterViewInit() {
    this.refreshListBox();
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
    if (this.linkWindow) {
      this.linkWindow.destroyWindow();
    }
  }

  // TABLE

  // refresh table
  refresh_jqxgGrid() {
    if (this.gateways && this.gateways.length > 0 && this.rowcount !== this.gateways.length) {
      this.source_jqxgrid.localdata = this.gateways;
      this.rowcount = this.gateways.length;
      this.myGrid.updatebounddata('data');
    }
  }

  refresh_del() {
    this.myGrid.deleterow(this.selectGateway.gatewayId);
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
    for (let i = 0; i < this.myListBox.attrSource.length; i++) {
      if (this.myListBox.attrSource[i].checked) {
        this.myGrid.showcolumn(this.myListBox.attrSource[i].value);
      } else {
        this.myGrid.hidecolumn(this.myListBox.attrSource[i].value);
      }
    }
    this.myGrid.endupdate();
  };

  // functions-events when allocating a string
  onRowSelect(event: any) {
    if (event.args.row
    ) {
      this.selectGateway = event.args.row;
      this.editrow = this.selectGateway.gatewayId;

      // refresh child grid
      if (this.isMasterGrid) {
        this.onRefreshChildGrid.emit(this.selectGateway.gatewayId);
      }
    }
    // this.updateButtons('Select');
  };

  // INSERT, UPDATE, DELETE

  // insert node
  ins() {
    const selectGateway: Gateway = new Gateway();
    selectGateway.nodeId = this.selectNodeId;

    this.editWindow.positionWindow({x: 600, y: 90});
    this.editWindow.openWindow(selectGateway, 'ins');
  }

  // update node
  upd() {
    this.editWindow.positionWindow({x: 600, y: 90});
    this.editWindow.openWindow(this.selectGateway, 'upd');
  }

  saveEditwinBtn() {
    // refresh table
    this.onRefreshGrid.emit();
  }

  saveLinkwinBtn(event: ItemsLinkForm) {
    if (event.code === this.sourceForLinkForm.window.code) {
      this.oSubLink = this.gatewayService.setNodeId(this.selectNodeId, event.Ids).subscribe(
        response => {
          MaterialService.toast('Выбранные елементы привязаны!');
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
    this.oSubForLinkWin = this.gatewayService.getGatewayNotInGroup().subscribe(
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
    if (this.selectGateway.gatewayId) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'del';
      this.warningEventWindow = `Удалить шлюз id = "${this.selectGateway.gatewayId}"?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать шлюз для удаления`;
    }
    this.eventWindow.openEventWindow();
  }

  okEvenwinBtn() {
    if (this.actionEventWindow === 'del') {
      const selectedrowindex = this.myGrid.getselectedrowindex();
      const id = this.myGrid.getrowid(selectedrowindex);

      if (+id >= 0) {
        this.gatewayService.del(+id).subscribe(
          response => {
            MaterialService.toast('Шлюз был удален!');
          },
          error => MaterialService.toast(error.error.message),
          () => {
            this.refresh_del();
          }
        );
      }
    }

    if (this.actionEventWindow === 'pin_drop') {
      const gatewayIds = [];
      for (let i = 0; i < this.myGrid.widgetObject.selectedrowindexes.length; i++) {
        gatewayIds[i] = this.source_jqxgrid.localdata[this.myGrid.widgetObject.selectedrowindexes[i]].gatewayId;
      }
      this.oSub = this.gatewayService.delNodeId(this.selectNodeId, gatewayIds).subscribe(
        response => {
          MaterialService.toast('Шлюзы отвязаны от узла!');
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
    if (this.selectNodeId > 1) {
      this.linkWindow.openWindow();
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать узел для привязки шлюзов`;
      this.eventWindow.openEventWindow();
    }
  }

  pin_drop() {
    if (this.selectGateway.gatewayId) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'pin_drop';
      this.warningEventWindow = `Отвязать шлюз от узла?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать шлюз для отвязки от узла`;
    }
    this.eventWindow.openEventWindow();
  }

}
