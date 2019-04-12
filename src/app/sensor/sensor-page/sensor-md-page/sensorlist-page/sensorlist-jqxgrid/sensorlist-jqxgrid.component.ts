import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {MaterialService} from '../../../../../shared/classes/material.service';
import {jqxGridComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid';
import {jqxListBoxComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxlistbox';
import {jqxButtonComponent} from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxbuttons';

import {Sensor, Geograph, Contract, Owner, EquipmentType, SourceForLinkForm, ItemsLinkForm} from '../../../../../shared/interfaces';

import {SensorService} from '../../../../../shared/services/sensor/sensor.service';
import {EventWindowComponent} from '../../../../../shared/components/event-window/event-window.component';
import {SensoreditFormComponent} from '../sensoredit-form/sensoredit-form.component';
import {LinkFormComponent} from '../../../../../shared/components/link-form/link-form.component';

@Component({
  selector: 'app-sensorlist-jqxgrid',
  templateUrl: './sensorlist-jqxgrid.component.html',
  styleUrls: ['./sensorlist-jqxgrid.component.css']
})
export class SensorlistJqxgridComponent implements OnInit, OnDestroy, AfterViewInit {

// variables from master component
  @Input() sensors: Sensor[];
  @Input() geographs: Geograph[];
  @Input() ownerSensors: Owner[];
  @Input() sensorTypes: EquipmentType[];
  @Input() contractSensors: Contract[];

  @Input() selectNodeId: number;

  @Input() heightGrid: number;
  @Input() isMasterGrid: number;
  @Input() selectionmode: string;

  // determine the functions that need to be performed in the parent component
  @Output() onRefreshGrid = new EventEmitter();
  @Output() onRefreshChildGrid = new EventEmitter<number>();

  // define variables - link to view objects
  @ViewChild('myListBox') myListBox: jqxListBoxComponent;
  @ViewChild('myGrid') myGrid: jqxGridComponent;
  @ViewChild('editWindow') editWindow: SensoreditFormComponent;
  @ViewChild('eventWindow') eventWindow: EventWindowComponent;
  @ViewChild('warningEventWindow') warningEventWindow: string;
  @ViewChild('okButton') okButton: jqxButtonComponent;
  @ViewChild('linkWindow') linkWindow: LinkFormComponent;

  // other variables
  selectSensor: Sensor = new Sensor();
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
      localdata: this.sensors,
      id: 'sensorId',

      sortcolumn: ['sensorId'],
      sortdirection: 'desc'
    };
  dataAdapter_jqxgrid: any = new jqx.dataAdapter(this.source_jqxgrid);

  // define columns for table
  columns: any[] =
    [
      {text: 'sensorId', datafield: 'sensorId', width: 150},
      {text: 'Договор', datafield: 'contractCode', width: 150},
      {text: 'Географическое понятие', datafield: 'geographCode', width: 150},
      {text: 'Тип сенсора', datafield: 'sensorTypeCode', width: 150},
      {text: 'Владелец', datafield: 'ownerCode', width: 150},

      {text: 'Широта', datafield: 'n_coordinate', width: 150},
      {text: 'Долгота', datafield: 'e_coordinate', width: 150},

      {text: 'Серийный номер', datafield: 'serialNumber', width: 150},
      {text: 'Коментарий', datafield: 'comment', width: 150},
    ];

  // define a data source for filtering table columns
  listBoxSource: any[] =
    [
      {label: 'sensorId', value: 'sensorId', checked: true},
      {label: 'Договор', value: 'contractCode', checked: true},
      {label: 'Географическое понятие', value: 'geographCode', checked: true},
      {label: 'Тип сенсора', value: 'sensorTypeCode', checked: true},
      {label: 'Владелец', value: 'ownerCode', checked: true},

      {label: 'Широта', value: 'n_coordinate', checked: true},
      {label: 'Долгота', value: 'e_coordinate', checked: true},

      {label: 'Серийный номер', value: 'serialNumber', checked: true},
      {label: 'Коментарий', value: 'comment', checked: true},
    ];


  constructor(private sensorService: SensorService) {
  }

  ngOnInit() {
    this.refresh_jqxgGrid();

    // Definde filter
    this.sourceForLinkForm = {
      window: {
        code: 'linkSensor',
        name: 'Выбрать датчик',
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

        valueMember: 'sensorId',
        sortcolumn: ['sensorId'],
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
  }

  // TABLE

  // refresh table
  refresh_jqxgGrid() {
    if (this.sensors && this.sensors.length > 0 && this.rowcount !== this.sensors.length) {
      this.source_jqxgrid.localdata = this.sensors;
      this.rowcount = this.sensors.length;
      this.myGrid.updatebounddata('data');
    }
  }

  refresh_del() {
    this.myGrid.deleterow(this.selectSensor.sensorId);
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

  onRowSelect(event: any) {
    if (event.args.row
    ) {
      this.selectSensor = event.args.row;
      this.editrow = this.selectSensor.sensorId;

      // refresh child grid
      if (this.isMasterGrid) {
        this.onRefreshChildGrid.emit(this.selectSensor.sensorId);
      }
    }
  };


  // INSERT, UPDATE, DELETE

  // insert node
  ins() {
    const selectSensor: Sensor = new Sensor();
    selectSensor.nodeId = this.selectNodeId;

    this.editWindow.positionWindow({x: 600, y: 90});
    this.editWindow.openWindow(selectSensor, 'ins');
  }

  // update node
  upd() {
    this.editWindow.positionWindow({x: 600, y: 90});
    this.editWindow.openWindow(this.selectSensor, 'upd');
  }

  saveEditwinBtn() {
    // refresh table
    this.onRefreshGrid.emit();
  }

  saveLinkwinBtn(event: ItemsLinkForm) {
    if(event.code === this.sourceForLinkForm.window.code){
      this.oSubLink = this.sensorService.setNodeId(this.selectNodeId, event.Ids).subscribe(
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
    this.oSubForLinkWin = this.sensorService.getSensorNotInGroup().subscribe(
      response => {
        this.sourceForLinkForm.grid.source = response;
        this.linkWindow.refreshGrid();
      },
      error => {
        MaterialService.toast(error.error.message);
      }
    );
  }

  // insEditwinBtn(event: any) {
  //   // this.refresh_ins(event);
  //     // refresh table
  //     this.onRefreshGrid.emit();
  // }
  //
  // updEditwinBtn() {
  //   // this.refresh_upd();
  //   // refresh table
  //   this.onRefreshGrid.emit();
  // }

  // delete node
  del() {
    if (this.selectSensor.sensorId) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'del';
      this.warningEventWindow = `Удалить датчик id = "${this.selectSensor.sensorId}"?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать датчик для удаления`;
    }
    this.eventWindow.openEventWindow();
  }

  okEvenwinBtn() {
    if (this.actionEventWindow === 'del') {
      const selectedrowindex = this.myGrid.getselectedrowindex();
      const id = this.myGrid.getrowid(selectedrowindex);

      if (+id >= 0) {
        this.sensorService.del(+id).subscribe(
          response => {
            MaterialService.toast('Датчик был удален!');
          },
          error => MaterialService.toast(error.error.message),
          () => {
            this.refresh_del();
          }
        );
      }
    }
    if (this.actionEventWindow === 'pin_drop') {
      const sensorIds = [];
      for (let i = 0; i < this.myGrid.widgetObject.selectedrowindexes.length; i++) {
        sensorIds[i] = this.source_jqxgrid.localdata[this.myGrid.widgetObject.selectedrowindexes[i]].sensorId;
      }
      this.oSub = this.sensorService.delNodeId(this.selectNodeId, sensorIds).subscribe(
        response => {
          MaterialService.toast('Датчики отвязаны от узла!');
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
    if (this.selectSensor.sensorId) {
      this.eventWindow.okButtonDisabled(false);
      this.actionEventWindow = 'pin_drop';
      this.warningEventWindow = `Отвязать датчик от узла?`;
    } else {
      this.eventWindow.okButtonDisabled(true);
      this.warningEventWindow = `Вам следует выбрать датчик для отвязки от узла`;
    }
    this.eventWindow.openEventWindow();
  }
}
